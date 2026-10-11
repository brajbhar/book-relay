package com.bookrelay.auth.service;

import com.bookrelay.auth.dto.AddressRequest;
import com.bookrelay.auth.dto.AddressResponse;
import com.bookrelay.auth.dto.LoginRequest;
import com.bookrelay.auth.dto.PublicUserResponse;
import com.bookrelay.auth.dto.RegisterRequest;
import com.bookrelay.auth.dto.TokenResponse;
import com.bookrelay.auth.dto.UpdateProfileRequest;
import com.bookrelay.auth.dto.UserProfileResponse;
import com.bookrelay.auth.entity.User;
import com.bookrelay.auth.entity.UserAddress;
import com.bookrelay.auth.repository.UserAddressRepository;
import com.bookrelay.auth.repository.UserRepository;
import com.bookrelay.auth.security.JwtService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            UserAddressRepository addressRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDisplayName(request.displayName());
        user = userRepository.save(user);
        return toProfile(user);
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new TokenResponse(token, jwtService.getExpirationMs() / 1000);
    }

    public UserProfileResponse getProfile(UUID userId) {
        return toProfile(findUser(userId));
    }

    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = findUser(userId);
        if (request.displayName() != null) {
            user.setDisplayName(request.displayName());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        return toProfile(userRepository.save(user));
    }

    public UserProfileResponse getUserById(UUID userId) {
        return toProfile(findUser(userId));
    }

    public PublicUserResponse getPublicProfile(UUID userId) {
        User user = findUser(userId);
        return new PublicUserResponse(user.getId(), user.getDisplayName(), user.getCreatedAt());
    }

    public List<AddressResponse> listAddresses(UUID userId) {
        return addressRepository.findByUserId(userId).stream().map(this::toAddress).toList();
    }

    @Transactional
    public AddressResponse createAddress(UUID userId, AddressRequest request) {
        if (Boolean.TRUE.equals(request.isDefault())) {
            clearDefault(userId);
        }
        UserAddress address = mapAddress(new UserAddress(), userId, request);
        if (!addressRepository.findByUserId(userId).iterator().hasNext()) {
            address.setDefault(true);
        }
        return toAddress(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(UUID userId, UUID addressId, AddressRequest request) {
        UserAddress address = addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
        if (Boolean.TRUE.equals(request.isDefault())) {
            clearDefault(userId);
        }
        return toAddress(addressRepository.save(mapAddress(address, userId, request)));
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        UserAddress address = addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
        addressRepository.delete(address);
    }

    private void clearDefault(UUID userId) {
        addressRepository.findByUserId(userId).forEach(a -> {
            if (a.isDefault()) {
                a.setDefault(false);
                addressRepository.save(a);
            }
        });
    }

    private User findUser(UUID userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserProfileResponse toProfile(User user) {
        return new UserProfileResponse(
                user.getId(), user.getEmail(), user.getDisplayName(), user.getPhone(), user.getCreatedAt());
    }

    private AddressResponse toAddress(UserAddress a) {
        return new AddressResponse(
                a.getId(),
                a.getLabel(),
                a.getLine1(),
                a.getLine2(),
                a.getCity(),
                a.getState(),
                a.getPostalCode(),
                a.getCountry(),
                a.getLatitude(),
                a.getLongitude(),
                a.isDefault());
    }

    private UserAddress mapAddress(UserAddress address, UUID userId, AddressRequest request) {
        address.setUserId(userId);
        if (request.label() != null) {
            address.setLabel(request.label());
        }
        address.setLine1(request.line1());
        address.setLine2(request.line2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPostalCode(request.postalCode());
        if (request.country() != null) {
            address.setCountry(request.country());
        }
        address.setLatitude(request.latitude());
        address.setLongitude(request.longitude());
        if (request.isDefault() != null) {
            address.setDefault(request.isDefault());
        }
        return address;
    }
}
