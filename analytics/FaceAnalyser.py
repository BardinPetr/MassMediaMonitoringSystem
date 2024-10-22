from math import inf

import requests

from settings import credentials


class FaceAnalyser:
    face_api_url = 'https://mmm.cognitiveservices.azure.com/face/v1.0/detect'
    params = {
        'returnFaceId': 'false',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender',
    }

    headers = {
        'Ocp-Apim-Subscription-Key': credentials["microsoft_api_key"]
    }

    @staticmethod
    def process(url):
        res = requests.post(url=FaceAnalyser.face_api_url,
                            params=FaceAnalyser.params,
                            headers=FaceAnalyser.headers,
                            json={"url": url})
        try:
            res = res.json()[0]["faceAttributes"]
            return {
                "sex": ("female", "male").index(res["gender"]),
                "age": filter(lambda x: x[1][0] <= res["age"] <= x[1][1],
                              enumerate([[0, 14],
                                         [15, 21],
                                         [22, 35],
                                         [36, 50],
                                         [50, inf]])).__next__()[0]
            }
        except IndexError:
            return {"sex": -1, "age": -1}
        except KeyError:
            return {"sex": -1, "age": -1}
