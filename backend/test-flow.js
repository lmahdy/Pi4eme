const http = require('http');

const req = http.request(
    {
        hostname: 'localhost',
        port: 3000,
        path: '/auth/forgot-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    },
    (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
            console.log('Forgot Password response:', data);
            const token = JSON.parse(data).token;

            const req2 = http.request(
                {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/auth/reset-password',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                },
                (res2) => {
                    let data2 = '';
                    res2.on('data', (c) => (data2 += c));
                    res2.on('end', () => {
                        console.log('Reset Password response status:', res2.statusCode);
                        console.log('Reset Password response body:', data2);
                    });
                }
            );
            req2.write(JSON.stringify({ token, newPassword: 'Password123!' }));
            req2.end();
        });
    }
);
req.write(JSON.stringify({ email: 'ttttfarah@gmail.com' }));
req.end();
