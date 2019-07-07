from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def map_data_endpoint(request, format=None):
    return Response({
        "fields": [
            {"name": "latitude", "format": "", "tableFieldIndex": 1, "type": "real"},
            {"name": "longitude", "format": "", "tableFieldIndex": 2, "type": "real"},
            {"name": "value", "format": "", "tableFieldIndex": 3, "type": "real"},
            {"name": "comment", "format": "", "tableFieldIndex": 4, "type": "string"}
        ],
        "rows": []
    })
