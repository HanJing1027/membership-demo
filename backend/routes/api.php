<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use SadiqSalau\LaravelOtp\Facades\Otp;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Otp\mailotp;
use App\Mail\resetPwMail;

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


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//   return $request->user();
// });

#region 註冊
Route::post('/register', function (Request $request) {
  try {

    $request->validate([
      'username' => 'required|string|max:255',
      'email' => 'required|string|email|unique:users',
      'password' => 'required|string',
    ]);

    $otp = Otp::identifier($request->email)->send(
      new mailotp(
        $request->username,
        $request->email,
        $request->password
      ),
      Notification::route('mail', $request->email)
    );
    return response()->json(['message' => $otp['status']], 201);
  } catch (\Exception $e) {
    //已經有這個email了
    if ($e->getMessage() == "The email has already been taken.") {
      return response()->json(['message' => 'Email already exists'], 460);
    } else {
      return response()->json(['message' => 'User registration failed', 'error' => $e->getMessage()], 500);
    }
  }
})->name('register');

Route::post('/verify', function (Request $request) {
  try {
    $request->validate([
      'email' => 'required|string|email',
      'otp' => 'required|string',
    ]);

    $otp = Otp::identifier($request->email)->attempt($request->otp);
    if ($otp['status'] == Otp::OTP_PROCESSED) {
      return response()->json(['message' => 'OTP verified successfully'],200);
    } else {
      return response()->json(['message' => 'Invalid OTP'], 401);
    }
  } catch (\Exception $e) {
    return response()->json(['message' => 'OTP verification failed', 'error' => $e->getMessage()], 400);
  }
})->name('verify');

Route::post('resendotp', function (Request $request) {
  try {
    $request->validate([
      'email' => 'required|string|email',
    ]);

    $otp = Otp::identifier($request->email)->update();
    if($otp['status'] != Otp::OTP_SENT)
    {      
      Log::debug('OTP resend attempt', ['email' => $request->email, 'status' => $otp['status']]);
      return response()->json([
        'message' => 'OTP resend failed',
        'error' => __($otp['status'])
    ], 422);
    }
    return response()->json(['message' => $otp['status']], 201);
  } catch (\Exception $e) {
    return response()->json(['message' => 'Resend OTP failed', 'error' => $e->getMessage()], 500);
  }
})->name('resendotp');

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
        // 'type' => 'bearer',
        // 'expires_in' => config('jwt.ttl'), // token有效時間
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
        // 'type' => 'bearer',
        // 'expires_in' => config('jwt.ttl'), // token有效時間
      ]
    ]);
  } catch (\Exception $e) {
    if ($e->getMessage() == "Token has expired and can no longer be refreshed") {
      return response()->json(['message' => 'Token is died'], 401);
    } else {
      return response()->json(['message' => 'Token refresh failed', 'error' => $e->getMessage()], 500);
    }
  }
})->name('refresh');
#endregion

#region 用戶私人資料
Route::middleware('auth:api')->get('/userData', function (Request $request) {
  try {
    // 獲取當前認證用戶
    $user = Auth::guard('api')->user();
    if (!$user) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }

    $userAvatar = DB::table('user_avatars')->where('user_id', $user->id)->first();
    // 返回受保護的資料和用戶信息
    return response()->json([
      'userInfo' => [
        'username' => $user->username,
        'userAvatar' => $userAvatar?? null,
        'email' => $user->email,
        'createdAt' => $user->created_at
      ]
    ]);
  } catch (\Exception $e) {
    return response()->json(['message' => '獲取資料失敗', 'error' => $e->getMessage()], 500);
  }
})->name('userData');
#endregion

#region 用戶修改密碼
Route::middleware('auth:api')->post('/updatepassword', function (Request $request) {
  try {

    // 獲取當前認證用戶
    $user = Auth::guard('api')->user();

    $request->validate([
      'oldPassword' => 'required|string',
      'newPassword' => 'required|string',
    ]);
    
    if (!Hash::check($request->oldPassword, $user->password)) {
      return response()->json(['message' => 'Old password is incorrect'], 401);
    }
    $user->password = Hash::make($request->newPassword);
    $user->save();
    
    return response()->json(['message' => 'Password updated successfully'], 200);
  } catch (\Exception $e) {
    return response()->json(['message' => 'Password update failed', 'error' => $e->getMessage()], 500);
  }
})->name('updatepassword');
#endregion

#region 密碼重設
Route::post('/forgotPassword', function (Request $request) {
  try {
    $request->validate([
      'email' => 'required|string|email',
    ]);

    $user = User::where('email', $request->email)->first();
    if (!$user) {
      return response()->json(['message' => 'email not found'], 404);
    }

    // 生成重設密碼 token
    $token = Str::random(30);
    error_log($token);
    

    //發送重設密碼郵件
    Mail::to($request->email)->send(new resetPwMail($token, $request->email));
    // 儲存token到資料庫
    DB::table('password_reset_tokens')->insert([
      'email' => $request->email,
      'token' => $token,
      'created_at' => now()
    ]);

    return response()->json(['message' => 'mail send'], 200);
  } catch (\Exception $e) {
    return response()->json(['message' => 'send mail error', 'error' => $e->getMessage()], 500);
  }
})->name('forgotPassword');

Route::post('/resetPassword', function (Request $request) {
  try {
    $request->validate([
      'token' => 'required|string',
      'newPassword' => 'required|string'
    ]);

    $resetRecord = DB::table('password_reset_tokens')->where('token', $request->token)->first();
    $email = $resetRecord->email ?? null;

    if (!$resetRecord) {
      return response()->json(['message' => 'token not found'], 401);
    }

    // 檢查token是否過期
    if (now()->diffInMinutes($resetRecord->created_at) > env('PASSWORD_RESET_TOKEN_EXPIRE')) {
      return response()->json(['message' => 'token is died'], 401);
    }

    // 更新密碼
    $user = User::where('email', $email)->first();
    $user->password = Hash::make($request->newPassword);
    $user->save();

    // 刪除重設記錄
    DB::table('password_reset_tokens')->where('email', $email)->delete();

    return response()->json(['message' => 'password reset success'], 200);
  } catch (\Exception $e) {
    return response()->json(['message' => 'password reset failed', 'error' => $e->getMessage()], 500);
  }
})->name('resetPassword');
#endregion

#region 用戶資料更新
Route::middleware('auth:api')->post('/updateUserData', function (Request $request) {
  try {
    // 獲取當前認證用戶
    $user = Auth::guard('api')->user();
    if (!$user) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }

    $request->validate([
      'username' => 'required|string'
    ]);

    $user->username = $request->username;
    $user->save();

    return response()->json(['message' => 'User data updated successfully'], 200);
  } catch (\Exception $e) {
    return response()->json(['message' => 'User data update failed', 'error' => $e->getMessage()], 500);
  }
})->name('updateUserData');
#endregion

#region 頭貼資料更新
Route::middleware('auth:api')->post('/updateAvatar', function (Request $request) {
  try {
    // 獲取當前認證用戶
    $user = Auth::guard('api')->user();
    if (!$user) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }

    $request->validate([
      'avatar' => 'required|image|mimes:jpeg,png,jpg',
    ]);

    // 確保 avatars 資料夾存在
    $avatarPath = public_path('avatars');
    if (!file_exists($avatarPath)) {
      mkdir($avatarPath, 0777, true);
    }    

    // 刪除舊的頭像記錄
    $oldAvatar = DB::table('user_avatars')->where('user_id', $user->id)->first();
    if ($oldAvatar) {
      // 刪除舊的頭像文件
      $oldAvatarPath = public_path('avatars/' . $oldAvatar->avatar_filename);
      if (file_exists($oldAvatarPath)) {
        unlink($oldAvatarPath);
      }
    }

    $file = $request->file('avatar');
    $filename = "{$user->username}_avatar{$user->id}.{$file->extension()}";
    $file->move($avatarPath, $filename);

    // 更新用戶頭像記錄
    DB::table('user_avatars')->updateOrInsert(
      ['user_id' => $user->id],
      [
        'avatar_filename' => $filename,
        'updated_at' => now()
      ]
    );

    return response()->json(['message' => 'Avatar uploaded successfully'], 200);
  } catch (\Exception $e) {
    return response()->json(['message' => 'Avatar upload failed', 'error' => $e->getMessage()], 500);
  }
})->name('uploadAvatar');
