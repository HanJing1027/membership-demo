<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class resetPwMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * 重設密碼的 token
     */
    protected string $token;

    /**
     * 使用者的 email
     */
    protected string $email;

    /**
     * Create a new message instance.
     */
    public function __construct(string $token, string $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '重設密碼',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $resetUrl =env('FRONTEND_URL')."/reset-password?token=".$this->token;

        return new Content(
            view: 'emails.reset-password',
            with: [
                'resetUrl' => $resetUrl,
                'expireMinutes' => env('PASSWORD_RESET_TOKEN_EXPIRE')
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
