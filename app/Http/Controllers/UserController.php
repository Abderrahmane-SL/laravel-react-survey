<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Return the authenticated user's profile as JSON.
     *
     * GET /api/user
     */
    public function me(Request $request)
    {
        // $request->user() is the currently authenticated user (via Sanctum or other guard).
        $user = $request->user();

        // If for some reason $user is null, return a 401
        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        return response()->json([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            // If you want to store just “avatars/xyz.jpg” in DB, you can do:
            // Storage::url($user->avatar_url)
            // Or if you already store “/storage/avatars/xyz.jpg” in the DB, return it directly:
            'avatar_url'  => $user->avatar_url ? url($user->avatar_url) : null,
            'created_at'  => $user->created_at,
            'updated_at'  => $user->updated_at,
        ]);
    }

    /**
     * Update the authenticated user's profile (name, email, optional password).
     *
     * PUT /api/user
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            // If the frontend sends a new_password, then current_password is required.
            'current_password'      => 'nullable|required_with:new_password|string',
            // confirmed rule expects a field named new_password_confirmation in the request
            'new_password'          => 'nullable|min:8|confirmed',
            // Laravel’s “confirmed” rule automatically checks for “new_password_confirmation”
            // You do not need to explicitly list new_password_confirmation in validator rules here.
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // If the user provided a new_password, verify current_password first
        if (! empty($validated['new_password'])) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect',
                    'errors'  => [
                        'current_password' => [ 'The current password is incorrect.' ]
                    ]
                ], 422);
            }

            // Hash & set the new password
            $validated['password'] = Hash::make($validated['new_password']);
        }

        // We do NOT want to mass‐assign the password confirmation or the raw new_password
        unset($validated['current_password'], $validated['new_password'], $validated['new_password_confirmation']);

        // Update name, email, (and password if provided)
        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'avatar_url' => $user->avatar_url ? url($user->avatar_url) : null,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    /**
     * Update (upload) the authenticated user's avatar.
     *
     * POST /api/user/avatar
     */
    public function updateAvatar(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // If the user already had an avatar stored, delete the old file from "public"
        if ($user->avatar_url) {
            // We assume avatar_url in the DB is something like "/storage/avatars/abc123.jpg"
            $oldPath = str_replace('/storage/', '', $user->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Store the new avatar under storage/app/public/avatars
        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $avatarUrl = $avatarPath;
        $user->avatar_url = $avatarUrl;
        $user->save();
        // Update the DB column
        // $user->update([ 'avatar_url' => $avatarUrl ]);
        return response()->json([
            'message' => 'Avatar updated successfully',
            'user'    => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'avatar_url' => url($user->avatar_url),
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }
}
