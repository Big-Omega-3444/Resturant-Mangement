# This creates random inputs for a list of fields

import random
import string
from templates import Templates

class Randomizer():
    def make_string(self, vals, known_objs):
        if len(vals.split(',')) == 1:
            return ''.join(random.choice(string.ascii_letters) for i in range(10))
        else:
            choices = vals.split(',')[1:]
            return random.choice(choices)

    def make_int(self, vals, known_objs):
        ls = vals.split(',')
        if len(ls) == 1:
            return random.randint(0,999999999)
        elif len(ls) == 3:
            return random.randint(int(ls[1]),int(ls[2]))

    def make_bool(self, vals, known_objs):
        return bool(random.randint(0,3))

    def make_email(self, vals, known_objs):
        email = ''.join(random.choice(string.ascii_letters) for i in range(10))
        email = email+"@mox.org"
        return email

    def make_float(self, vals, known_objs):
        return random.expovariate(5)

    def make_reference(self, vals, known_objs):
        ref_obj = vals.split(',')[1]
        # There should be an object in there, if not it's user error
        assert len(known_objs[ref_obj+'_template']) > 0
        # Return a random one of these
        return random.choice(known_objs[ref_obj+'_template']).strip('\n\"')

    def make_url(self, vals, known_objs):
        # Some random link to an image
        return "https://image.shutterstock.com/image-photo/red-apple-on-white-background-260nw-158989157.jpg"

    functions = {
        "String": make_string,
        "Int": make_int,
        "MyBoolean": make_bool,
        "Email": make_email,
        "Float": make_float,
        "URL": make_url,
        "Reference": make_reference,
    }


    # Make a random object
    # Known objs is a dict of arrays for each object type
    # {
    #   "employee": ["7yui23qrhfew3", "y28hfsdc"],
    #   "coupon": []
    # }
    # etc.
    # We expect the caller to add and remove these from the dict
    def make_random_dict(self, dict_in, known_objs, disable_reference=False):
        new_dict = dict_in.copy()
        for k, v in dict_in.items():
            # If a string
            if isinstance(v, str):
                # Check if it's one of the defined fields
                if self.functions[v.split(',')[0]] is not None and not (self.functions[v.split(',')[0]] == "Reference" and disable_reference):
                    new_dict[k] = self.functions[v.split(',')[0]](self, v, known_objs)
            elif isinstance(v, list):
                # check if the list has strings in it, and just pick a couple of the strings if so
                # Let's just pick a random number of elements from the list
                if isinstance(v[0], str):
                    new_dict[k] = random.sample(v, k=random.randint(1,len(v)))
                # If it's a dict we assume its an embedded document that needs it's own randomization
                elif isinstance(v[0], dict):
                    # We will make a couple of these and put them in the list
                    new_dict[k] = []
                    for _ in range(5):
                        new_dict[k].append(self.make_random_dict(v[0], known_objs, disable_reference))
                # Else give up and raise an error
                else:
                    raise ValueError("Unexpected type {} in list".format(v))
            elif isinstance(v, dict):
                # if it's just a dict we can generate for that
                new_dict[k] = self.make_random_dict(v, known_objs, disable_reference)
        return new_dict


    