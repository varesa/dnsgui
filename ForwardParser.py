import re

from ConfigDataTypes import Block, Record
from ForwardZone import ForwardZone

class ForwardParser:
    zone_raw = None
    ":type zone_raw: list(str)"

    zone_objects = None
    ":type zone_raw: list"

    def __init__(self, file):
        self.zone_raw = open(file, 'r').readlines()
        self.zone_objects = list()

    def parse(self):
        block = ""
        block_active = False
        block_range = None

        for line in self.zone_raw:
            if block_active:
                if line.startswith(";</block"):
                    if block_range:
                        self.zone_objects.append(Block(block, block_range[0], block_range[1]))
                    else:
                        self.zone_objects.append(Block(block))
                    block_active = False
                    block = ""
                    block_range = None
                else:
                    block += line

            elif line.startswith(";<block"):
                block_active = True
                if ':' in line:
                    result = re.search("<.*:([0-9]+):([0-9]+)>", line)
                    if result:
                        block_range = result.group(1), result.group(2)
                continue

            elif line.startswith(";"):
                self.zone_objects.append(Block(line))

            elif "A" in line or "CNAME" in line:
                self.zone_objects.append(Record(line))

        return ForwardZone(self.zone_objects)
