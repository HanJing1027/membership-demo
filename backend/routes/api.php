<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});

#region 註冊
Route::post('/register', function (Request $request) {
  try {

    $request->validate([
      'username' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string',
    ]);

    $user = User::create([
      'username' => $request->username,       // 現在兩處欄位名稱一致
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);
    return response()->json(['message' => 'User registered successfully'], 201);
  } catch (\Exception $e) {
    //已經有這個email了
    if ($e->getMessage() == "The email has already been taken.") {
      return response()->json(['message' => 'Email already exists'], 460);
    } else {
      return response()->json(['message' => 'User registration failed', 'error' => $e->getMessage()], 500);
    }
  }
})->name('register');

#endregion

#region 登入
Route::post('/login', function (Request $request) {
  try {
    $request->validate([
      'email' => 'required|string|email',
      'password' => 'required|string',
    ]);

    $token = Auth::guard('api')->attempt($request->only('email', 'password'));
    if (!$token) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }

    return response()->json([
      'username' => Auth::guard('api')->user()->username,
      'authorization' => [
        'token' => $token,
        'type' => 'bearer',
        'expires_in' => config('jwt.ttl'), // token有效時間
      ]
    ]);
  } catch (\Exception $e) {
    return response()->json(['message' => 'Login failed', 'error' => $e->getMessage()], 500);
  }
})->name('login');
#endregion
