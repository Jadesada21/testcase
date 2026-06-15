import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const payload = JSON.stringify({
        seatNumber: 'A1',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(
        'http://localhost:3000/bookings',
        payload,
        params
    );

    check(res, {
        'is 201': (r) => r.status === 201,
        'has booking': (r) => {
            try {
                return r.json('booking') !== undefined;
            } catch (e) {
                return false;
            }
        },
    });
    console.log(res.status, res.body);
}