<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('/register',function (Request $request) {
  try{

    $request->validate([
      'username' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string',
    ]);

    $user = new \App\Models\User();
    $user->username = $request->username;
    $user->email = $request->email;
    $user->password = bcrypt($request->password);
    $user->save();
    
    return response()->json(['message' => 'User registered successfully'], 201);
  }
  catch (\Exception $e){
    return response()->json(['message' => 'User registration failed', 'error' => $e->getMessage()], 500);
  }
})->name('register');
