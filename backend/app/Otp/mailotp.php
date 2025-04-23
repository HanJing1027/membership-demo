<?php

namespace App\Otp;

use SadiqSalau\LaravelOtp\Contracts\OtpInterface as Otp;
use Illuminate\Auth\Events\Registered;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class mailotp implements Otp
{
    /**
     * Constructs Otp class
     */
    public function __construct(
      protected string $username,
      protected string $email,
      protected string $password
    ) {}

    /**
     * Processes the Otp
     *
     * @return mixed
     */
    public function process()
    {
      $user = User::unguarded(function () {
        return User::create([
          'username'              => $this->username,
          'email'                 => $this->email,
          'password'              => Hash::make($this->password)
        ]);
      });
      event(new Registered($user));
      return $user;
    }
}
