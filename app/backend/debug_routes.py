#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

print("Registered routes:")
for rule in app.url_map.iter_rules():
    methods = rule.methods or set()
    print(f"  {rule.endpoint}: {rule.rule} [{', '.join(methods)}]")

print(f"\nTotal routes: {len(list(app.url_map.iter_rules()))}") 