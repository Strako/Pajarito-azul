from flask import Response
import json

def resfunc(data):
    return Response(json.dumps(data, sort_keys=False, ensure_ascii=False), content_type='application/json')
