class ReverseZone:
    def __init__(self, objects):
        self.objects = objects

    def to_dict(self):
        d = {'objects': list()}
        for object in self.objects:
            d['objects'].append(object.to_dict())
        return d