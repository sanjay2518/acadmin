import unittest
from urllib.parse import urlsplit

import main


class DummyURL:
    def __init__(self, url):
        self._url = url
        self.scheme = urlsplit(url).scheme
        self.netloc = urlsplit(url).netloc


class DummyRequest:
    def __init__(self, url, headers=None):
        self.url = DummyURL(url)
        self.headers = headers or {}


class XeroRedirectTests(unittest.TestCase):
    def test_deployed_callback_from_request_host(self):
        req = DummyRequest(
            "https://acadmin-seven.vercel.app/api/xero/connect/admin/abc",
            {"host": "acadmin-seven.vercel.app"},
        )
        self.assertEqual(
            main._resolve_redirect_uri(req),
            "https://acadmin-seven.vercel.app/api/xero/callback",
        )

    def test_local_callback_from_request_host(self):
        req = DummyRequest(
            "https://acadmin-seven.vercel.app/api/xero/connect",
            {"host": "localhost:8000"},
        )
        self.assertEqual(
            main._resolve_redirect_uri(req),
            "https://localhost:8000/api/xero/callback",
        )


if __name__ == "__main__":
    unittest.main()
