import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 50 },
  ],
};

export default function () {
  const url = 'http://nginx:80';
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '350s',
  };

  // Send multiple GET requests in succession
  for (let i = 0; i < 3; i++) {
    const res = http.get(url, params);
    check(res, {
      [`url status is 200 (iteration ${i})`]: (r) => r.status === 200,
    }) || errorRate.add(1);
  }
}

