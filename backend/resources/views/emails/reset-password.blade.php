<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>重設密碼</title>
    <style>
        body {
            font-family: '微軟正黑體', 'Microsoft JhengHei', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .note {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h2>密碼重設請求</h2>
    
    <p>您好，</p>
    
    <p>我們收到了您要求重設密碼的請求。請點擊下方按鈕來重設您的密碼：</p>
    
    <a href="{{ $resetUrl }}" class="button" target="_blank">重設密碼</a>
    
    <p class="note">
        如果您沒有要求重設密碼，請忽略此封郵件。<br>
        此連結將在 {{ $expireMinutes }} 分鐘後失效。
    </p>
    
    <p>祝您使用愉快！</p>
</body>
</html>
