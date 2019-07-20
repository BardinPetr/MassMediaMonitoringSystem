from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from DB.DB import DB
from process import generate_map


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
        "rows": generate_map(request.GET.get('query', ''))
    })


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def clusters_endpoint(request, format=None):
    q = request.GET
    if ('start' not in q.keys()) or ('end' not in q.keys()):
        return Response(status=400)
    return Response(DB().aggregate_posts(int(q['start']), int(q['end'])))


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def clusters_endpoint_sa(request, format=None):
    q = request.GET
    if ('start' not in q.keys()) or ('end' not in q.keys()):
        return Response(status=400)
    ar, sr, dsr = q.get('ar', None), q.get('sr', None), q.get('dsr', None)
    return Response(DB().aggregate_posts_sa(int(q['start']),
                                            int(q['end']),
                                            list(map(int, ar)) if ar and ar != "" else ar,
                                            list(map(int, sr)) if sr and sr != "" else sr,
                                            list(map(int, dsr)) if dsr and dsr != "" else dsr))
