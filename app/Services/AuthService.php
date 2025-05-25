<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthService
{
    public function __construct(protected UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data)
    {
        try {
            DB::beginTransaction();
            unset($data['password_confirmation']);
            $data['email_verified_at'] = now();
            $data['password'] = bcrypt($data['password']);
            $user = $this->userRepository->create($data);
            $token = $user->createToken('user', ['app:all'])->plainTextToken;

            DB::commit();
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "An error occurred while registering the user.",
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function login(array $data)
    {
        if (!Auth::attempt($data)) {
            return response()->json([
                'status' => false,
                'message' => "Invalid credentials.",
            ], 401);
        } else {
            $user = Auth::user();

            if ($user->email_verified_at === null) {
                return response()->json([
                    'status' => false,
                    'message' => "Your Email is not verified.",
                ], 401);
            }

            $user->tokens()->delete();

            $token = $user->createToken('user', ['app:all'])->plainTextToken;

            return response()->json([
                'data' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }
    }

    public function logout()
    {
        $user = Auth::user();

        if ($user) {
            $this->userRepository->deleteToken($user);

            return response()->json([
                'status' => true,
                'message' => 'Logged out successfully',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'No authenticated user found',
        ], 401);
    }
}
