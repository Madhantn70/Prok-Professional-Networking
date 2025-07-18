#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from flask import jsonify
import traceback

app = create_app()

print("Registered routes:")
for rule in app.url_map.iter_rules():
    methods = rule.methods or set()
    print(f"  {rule.endpoint}: {rule.rule} [{', '.join(methods)}]")

print(f"\nTotal routes: {len(list(app.url_map.iter_rules()))}")

@app.errorhandler(Exception)
def handle_exception(e):
    print("Exception occurred:", e)
    traceback.print_exc()
    return jsonify({'error': 'Internal server error'}), 500 