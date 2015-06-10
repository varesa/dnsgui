import re

class Block:
    def __init__(self, text, start=None, end=None):
        self.text = text.strip()
        self.start = start
        self.end = end

    def to_dict(self):
        return {'text': self.text, 'type': 'block', 'start': self.start, 'end': self.end}

class Record:
    def __init__(self, text):
        self._text = text.strip()
        parts = re.split("[\s\t]", self._text)

        self.lpart = parts[0].strip()
        self.rpart = parts[-1].strip()
        self.operator = ' '.join(parts[1:-1]).strip()

    def to_dict(self):
        return {'text': self._text, 'type': 'record',
                'lpart': self.lpart, 'operator': self.operator, 'rpart': self.rpart}
