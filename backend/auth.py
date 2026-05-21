"""
Enhanced Authentication Module with Two-Factor Authentication
Implements TOTP, backup codes, and email-based 2FA
"""

import pyotp
import qrcode
import io
import base64
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import secrets
import string


class TwoFactorAuth:
    """Enhanced 2FA implementation with multiple methods"""

    def __init__(self):
        self.otp_length = 6
        self.otp_interval = 30  # seconds
        self.backup_codes_count = 10
        self.totp_digits = 6

    def generate_totp_secret(self) -> str:
        """Generate a new TOTP secret key"""
        return pyotp.random_base32()

    def generate_totp_uri(self, secret: str, email: str) -> str:
        """Generate TOTP URI for QR code generation"""
        return pyotp.totp.TOTP(secret).provisioning_uri(
            name=email,
            issuer_name="CyberShield AI"
        )

    def generate_qr_code(self, secret: str, email: str) -> str:
        """Generate QR code for 2FA setup"""
        try:
            uri = self.generate_totp_uri(secret, email)
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(uri)
            qr.make(fit=True)

            # Convert to base64 string
            img = qr.make_image(fill_color="black", back_color="white")
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

            return qr_code_base64
        except Exception as e:
            print(f"QR code generation failed: {e}")
            return ""

    def verify_totp(self, secret: str, code: str) -> bool:
        """Verify TOTP code"""
        try:
            totp = pyotp.TOTP(secret)
            # Allow 1 time step tolerance (30 seconds window)
            return totp.verify(code, valid_window=1)
        except Exception:
            return False

    def generate_backup_codes(self, count: int = None) -> List[str]:
        """Generate backup codes for 2FA recovery"""
        if count is None:
            count = self.backup_codes_count

        codes = []
        for _ in range(count):
            # Generate random 8-character backup codes
            code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            codes.append(code)

        return codes

    def generate_email_otp(self, email: str) -> Dict:
        """Generate and store email OTP"""
        # Generate 6-digit OTP
        otp = ''.join(secrets.choice(string.digits) for _ in range(6))

        # Calculate expiration (10 minutes)
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        return {
            'otp': otp,
            'email': email,
            'expires_at': expires_at.isoformat(),
            'created_at': datetime.utcnow().isoformat()
        }

    def verify_email_otp(self, stored_otp: Dict, provided_otp: str) -> bool:
        """Verify email OTP"""
        try:
            # Check if expired
            expires_at = datetime.fromisoformat(stored_otp['expires_at'])
            if datetime.utcnow() > expires_at:
                return False

            # Verify OTP
            return stored_otp['otp'] == provided_otp
        except Exception:
            return False

    def generate_sms_otp(self, phone: str) -> Dict:
        """Generate and store SMS OTP"""
        # Generate 6-digit OTP
        otp = ''.join(secrets.choice(string.digits) for _ in range(6))

        # Calculate expiration (5 minutes for SMS)
        expires_at = datetime.utcnow() + timedelta(minutes=5)

        return {
            'otp': otp,
            'phone': phone,
            'expires_at': expires_at.isoformat(),
            'created_at': datetime.utcnow().isoformat()
        }

    def verify_sms_otp(self, stored_otp: Dict, provided_otp: str) -> bool:
        """Verify SMS OTP"""
        try:
            # Check if expired
            expires_at = datetime.fromisoformat(stored_otp['expires_at'])
            if datetime.utcnow() > expires_at:
                return False

            # Verify OTP
            return stored_otp['otp'] == provided_otp
        except Exception:
            return False

    def hash_backup_code(self, code: str) -> str:
        """Hash backup code for storage"""
        import hashlib
        return hashlib.sha256(code.encode()).hexdigest()

    def verify_backup_code(self, stored_codes: List[str], provided_code: str) -> bool:
        """Verify backup code"""
        import hashlib
        provided_hash = hashlib.sha256(provided_code.encode()).hexdigest()
        return provided_hash in stored_codes

    def generate_recovery_token(self, user_id: str) -> str:
        """Generate account recovery token"""
        import hashlib
        timestamp = str(int(datetime.utcnow().timestamp()))
        token_data = f"{user_id}-{timestamp}-{secrets.token_hex(8)}"
        return hashlib.sha256(token_data.encode()).hexdigest()[:32]

    def validate_2fa_method(self, method: str) -> bool:
        """Validate 2FA method"""
        valid_methods = ['totp', 'email', 'sms', 'backup']
        return method in valid_methods

    def get_2fa_status(self, user_data: Dict) -> Dict:
        """Get user's 2FA status"""
        two_factor = user_data.get('two_factor', {})

        return {
            'enabled': two_factor.get('enabled', False),
            'method': two_factor.get('method', None),
            'backup_codes_remaining': len(two_factor.get('backup_codes', [])),
            'last_used': two_factor.get('last_used', None),
            'setup_completed': two_factor.get('setup_completed', False)
        }

    def setup_2fa(self, user_id: str, email: str, method: str = 'totp') -> Dict:
        """Setup 2FA for user"""
        if not self.validate_2fa_method(method):
            raise ValueError(f"Invalid 2FA method: {method}")

        secret = self.generate_totp_secret()
        qr_code = self.generate_qr_code(secret, email)
        backup_codes = self.generate_backup_codes()

        return {
            'user_id': user_id,
            'method': method,
            'secret': secret,
            'qr_code': qr_code,
            'backup_codes': backup_codes,
            'setup_completed': False,
            'created_at': datetime.utcnow().isoformat()
        }

    def complete_2fa_setup(self, verification_code: str, setup_data: Dict) -> bool:
        """Complete 2FA setup with verification"""
        if not self.verify_totp(setup_data['secret'], verification_code):
            return False

        setup_data['setup_completed'] = True
        setup_data['last_used'] = datetime.utcnow().isoformat()
        return True

    def verify_2fa(self, user_data: Dict, code: str, method: Optional[str] = None) -> Dict:
        """Verify 2FA code using appropriate method"""
        two_factor = user_data.get('two_factor', {})

        if not two_factor.get('enabled', False):
            return {'success': False, 'message': '2FA not enabled'}

        if method is None:
            method = two_factor.get('method', 'totp')

        if method == 'totp':
            if self.verify_totp(two_factor['secret'], code):
                return {'success': True, 'message': '2FA verified'}
            else:
                return {'success': False, 'message': 'Invalid TOTP code'}

        elif method == 'backup':
            backup_codes = two_factor.get('backup_codes', [])
            if self.verify_backup_code(backup_codes, code):
                return {'success': True, 'message': 'Backup code verified', 'method': 'backup'}
            else:
                return {'success': False, 'message': 'Invalid backup code'}

        elif method == 'email':
            stored_otp = two_factor.get('email_otp')
            if stored_otp and self.verify_email_otp(stored_otp, code):
                return {'success': True, 'message': 'Email OTP verified'}
            else:
                return {'success': False, 'message': 'Invalid or expired OTP'}

        elif method == 'sms':
            stored_otp = two_factor.get('sms_otp')
            if stored_otp and self.verify_sms_otp(stored_otp, code):
                return {'success': True, 'message': 'SMS OTP verified'}
            else:
                return {'success': False, 'message': 'Invalid or expired OTP'}

        else:
            return {'success': False, 'message': f'Unsupported 2FA method: {method}'}

    def disable_2fa(self, user_data: Dict) -> Dict:
        """Disable 2FA for user"""
        user_data['two_factor'] = {
            'enabled': False,
            'method': None,
            'secret': None,
            'backup_codes': [],
            'disabled_at': datetime.utcnow().isoformat()
        }

        return {'success': True, 'message': '2FA disabled successfully'}

    def regenerate_backup_codes(self, user_data: Dict) -> Dict:
        """Regenerate backup codes"""
        two_factor = user_data.get('two_factor', {})
        new_codes = self.generate_backup_codes()

        # Hash new codes for storage
        hashed_codes = [self.hash_backup_code(code) for code in new_codes]

        two_factor['backup_codes'] = hashed_codes
        two_factor['backup_codes_regenerated_at'] = datetime.utcnow().isoformat()

        return {
            'success': True,
            'backup_codes': new_codes,  # Return unhashed codes for user to save
            'message': 'Backup codes regenerated successfully'
        }

    def check_2fa_setup_expiry(self, setup_data: Dict, expiry_hours: int = 24) -> bool:
        """Check if 2FA setup has expired"""
        if 'created_at' not in setup_data:
            return True

        created_at = datetime.fromisoformat(setup_data['created_at'])
        expiry_time = created_at + timedelta(hours=expiry_hours)

        return datetime.utcnow() > expiry_time

    def get_2fa_statistics(self, user_data: Dict) -> Dict:
        """Get 2FA usage statistics"""
        two_factor = user_data.get('two_factor', {})

        return {
            'enabled': two_factor.get('enabled', False),
            'method': two_factor.get('method', None),
            'backup_codes_remaining': len(two_factor.get('backup_codes', [])),
            'last_used': two_factor.get('last_used', None),
            'setup_completed': two_factor.get('setup_completed', False),
            'security_score': self._calculate_security_score(two_factor)
        }

    def _calculate_security_score(self, two_factor: Dict) -> int:
        """Calculate security score based on 2FA configuration"""
        score = 0

        if two_factor.get('enabled', False):
            score += 40

        if two_factor.get('setup_completed', False):
            score += 30

        if len(two_factor.get('backup_codes', [])) > 5:
            score += 20

        if two_factor.get('method') == 'totp':
            score += 10

        return min(100, score)


# Email OTP Management (Simplified - would integrate with email service in production)
class EmailOTPManager:
    """Manage email OTP sending and validation"""

    def __init__(self):
        self.pending_otps = {}  # In production, this would use Redis/database

    def send_email_otp(self, email: str, otp: str) -> bool:
        """Send OTP via email (placeholder for production)"""
        # In production, integrate with email service (SendGrid, Mailgun, etc.)
        print(f"Email OTP sent to {email}: {otp}")  # Development logging
        return True

    def store_email_otp(self, email: str, otp_data: Dict):
        """Store email OTP data"""
        self.pending_otps[email] = otp_data

    def get_email_otp(self, email: str) -> Optional[Dict]:
        """Get stored email OTP data"""
        return self.pending_otps.get(email)

    def clear_email_otp(self, email: str):
        """Clear email OTP after use"""
        if email in self.pending_otps:
            del self.pending_otps[email]


# SMS OTP Management (Simplified - would integrate with SMS service in production)
class SMSOTPManager:
    """Manage SMS OTP sending and validation"""

    def __init__(self):
        self.pending_otps = {}  # In production, this would use Redis/database

    def send_sms_otp(self, phone: str, otp: str) -> bool:
        """Send OTP via SMS (placeholder for production)"""
        # In production, integrate with SMS service (Twilio, etc.)
        print(f"SMS OTP sent to {phone}: {otp}")  # Development logging
        return True

    def store_sms_otp(self, phone: str, otp_data: Dict):
        """Store SMS OTP data"""
        self.pending_otps[phone] = otp_data

    def get_sms_otp(self, phone: str) -> Optional[Dict]:
        """Get stored SMS OTP data"""
        return self.pending_otps.get(phone)

    def clear_sms_otp(self, phone: str):
        """Clear SMS OTP after use"""
        if phone in self.pending_otps:
            del self.pending_otps[phone]


# Password Recovery & Account Recovery
class AccountRecovery:
    """Handle account recovery and password reset flows"""

    def __init__(self):
        self.reset_tokens = {}
        self.recovery_tokens = {}

    def generate_password_reset_token(self, user_id: str, email: str) -> Dict:
        """Generate password reset token"""
        import hashlib
        import secrets

        # Generate secure token
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        # Calculate expiration (1 hour)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        reset_data = {
            'user_id': user_id,
            'email': email,
            'token_hash': token_hash,
            'expires_at': expires_at.isoformat(),
            'created_at': datetime.utcnow().isoformat(),
            'used': False
        }

        self.reset_tokens[token_hash] = reset_data

        return {
            'token': token,  # Return token for email link
            'expires_at': expires_at.isoformat(),
            'email': email
        }

    def verify_reset_token(self, token: str) -> Optional[Dict]:
        """Verify password reset token"""
        import hashlib
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        reset_data = self.reset_tokens.get(token_hash)
        if not reset_data:
            return None

        # Check if expired
        expires_at = datetime.fromisoformat(reset_data['expires_at'])
        if datetime.utcnow() > expires_at:
            return None

        # Check if already used
        if reset_data.get('used', False):
            return None

        return reset_data

    def consume_reset_token(self, token: str) -> bool:
        """Mark reset token as used"""
        import hashlib
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        if token_hash in self.reset_tokens:
            self.reset_tokens[token_hash]['used'] = True
            return True
        return False

    def generate_security_questions(self) -> List[Dict]:
        """Generate security questions for account recovery"""
        questions = [
            {
                'id': 1,
                'question': 'What was the name of your first pet?',
                'category': 'personal'
            },
            {
                'id': 2,
                'question': 'In what city were you born?',
                'category': 'personal'
            },
            {
                'id': 3,
                'question': 'What was the make of your first car?',
                'category': 'personal'
            },
            {
                'id': 4,
                'question': 'What elementary school did you attend?',
                'category': 'personal'
            },
            {
                'id': 5,
                'question': 'What is the name of your favorite childhood teacher?',
                'category': 'personal'
            }
        ]

        return questions

    def hash_security_answer(self, answer: str) -> str:
        """Hash security answer"""
        import hashlib
        return hashlib.sha256(answer.lower().strip().encode()).hexdigest()

    def verify_security_answer(self, stored_hash: str, provided_answer: str) -> bool:
        """Verify security answer"""
        provided_hash = self.hash_security_answer(provided_answer)
        return provided_hash == stored_hash


# Initialize instances
two_factor_auth = TwoFactorAuth()
email_otp_manager = EmailOTPManager()
sms_otp_manager = SMSOTPManager()
account_recovery = AccountRecovery()