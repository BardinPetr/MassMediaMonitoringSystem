from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from process import generate_map


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def map_data_endpoint(request, format=None):
    return Response(generate_map(request.GET.get('query', '')))
