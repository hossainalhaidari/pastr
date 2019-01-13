#!/usr/bin/env python3
import sys
import os
from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.getenv('PASTR_PATH', 'App Path'))
from . import app as application
application.secret_key = os.getenv('SECRET_KEY', 'Secret Key')