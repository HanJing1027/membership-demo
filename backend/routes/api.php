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

#region 登出
Route::post('/logout', function (Request $request) {
  try {
    Auth::guard('api')->logout();
    return response()->json(['message' => 'User logged out successfully']);
  } catch (\Exception $e) {
    return response()->json(['message' => 'Logout failed', 'error' => $e->getMessage()], 500);
  }
})->name('logout');
#endregion

#region 刷新token
Route::post('/refresh', function (Request $request) {
  try {
    $token = Auth::guard('api')->refresh();
    return response()->json([
      'authorization' => [
        'token' => $token,
        'type' => 'bearer',
        'expires_in' => config('jwt.ttl'), // token有效時間
      ]
    ]);
  } catch (\Exception $e) {
    return response()->json(['message' => 'Token refresh failed', 'error' => $e->getMessage()], 500);
  }
})->name('refresh');
#endregion

#region 受保護的資料路由
Route::middleware('auth:api')->get('/protected-data', function (Request $request) {
  try {
    // 獲取當前認證用戶
    $user = Auth::guard('api')->user();
    
    // 返回受保護的資料和用戶信息
    return response()->json([
      'message' => '成功獲取受保護資料',
      'user_info' => [
        'id' => $user->id,
        'username' => $user->username,
        'email' => $user->email,
      ],
      'data' => [
        'sensitive_info' => '這是僅限授權用戶查看的敏感資訊',
        'timestamp' => now()->toDateTimeString(),
      ]
    ]);
  } catch (\Exception $e) {
    return response()->json(['message' => '獲取資料失敗', 'error' => $e->getMessage()], 500);
  }
})->name('protected-data');
#endregion
