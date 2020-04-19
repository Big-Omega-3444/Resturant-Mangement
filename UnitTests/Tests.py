import requests
from templates import Templates
from random_create import Randomizer
import jsons

num_tests = 0
num_success = 0
# This will be a list of all the ids for the objects we have created
objs = {}
# This is all of the actual items we submitted indexed by their id
objs_act = {}
# init objs to a set of empty lists
for k,v in Templates.__dict__.items():
    if "template" in k:
        objs[k] = []
        objs_act[k] = {}

def check_request_good(request):
    # Raises an error on a bad request
    try :
        request.raise_for_status()
        return True
    except:
        # print(request.text)
        if "NotUniqueError" in request.text:
            return False


# Takes json dict and outputs json dict in a form identical to what we sent
def clean_json(data):
    # If a dict iterate though the
    if isinstance(data, dict):
        new_dict = {}
        for k,v in data.items():

            # We don't care about the class
            if k == "_cls":
                continue
            # We don't care about the id
            if k == "_id":
                continue
            # This is just for the recursion
            if k == "$oid":
                # Should just be a string here
                return v
            # Ignore any empty lists
            if isinstance(v, list) and len(v) == 0:
                continue

            # Ignore the 'total_cost' var as this is dynamic
            if k == "total_cost":
                continue
            
            new_dict[k] = clean_json(v)
        return new_dict
    
    # If list iterate through
    if isinstance(data, list):
        new_list = []
        for i in data:
            new_list.append(clean_json(i))
        return new_list

    if isinstance(data, int):
        return data

    if isinstance(data, float):
        return data

    if isinstance(data, str):
        # Check if we have an int in a string
        try:
            i = int(data)
            return i
        except ValueError:
            pass

        # Check if we have a float
        try:
            i = float(data)
            return i
        except ValueError:
            pass

        # Check if we have a bool
        if data == "True":
            return True
        if data == "False":
            return False

        # Otherwise it's just a string
        return data
    # Something has gone horribly wrong
    print(data)
    raise Exception("WELL DAMN")
        

base_url = 'http://localhost/'
endpoints = ['api/users','api/employees','api/ingredients','api/menuitems','api/orders','api/menus','api/inventorys','api/coupons','api/specials','api/loyaltymembers','api/timesheets','api/tables','api/notifications','api/reservations']
# Do a GET request for every endpoint
for endpoint in endpoints:
    print("Testing GET {}".format(endpoint))
    num_tests += 1
    r = requests.get(base_url+endpoint)
    check_request_good(r)
    print(r)
    num_success += 1

# Create a couple of each object via a POST 
# and do a GET request to check if the values persisted
rando = Randomizer()
for k,v in Templates.__dict__.items():
    if "template" in k:
        print("Testing POST {}".format(k))
        for _ in range(5):
            num_tests += 1
            while True:
                rd = rando.make_random_dict(Templates.__dict__[k], objs)
                # print(rd)
                resp = requests.post(base_url+'api/'+k[:-len("_template")]+'s', json=rd)
                if check_request_good(resp):
                    break
            # All post requests should result in an id for the object
            assert isinstance(resp.text, str)
            objs[k].append(resp.text)
            objs_act[k][resp.text] = rd
            num_success += 1

# Do some GET requests to see if all of the data makes it back to us intact
for temp,dc in objs_act.items():
    print("Testing GET {}".format(temp))
    for k,v in dc.items():
        num_tests += 1
        resp = requests.get(base_url+'api/'+temp[:-len("_template")]+'s'+'/'+k.strip("\"\n"))
        
        check_request_good(resp)
        if clean_json(jsons.loads(resp.text)) == v:
            num_success += 1
        else:
            print("ERROR")
            print("JSON")
            print(clean_json(jsons.loads(resp.text)))
            print("OLD")
            print(v)

# Try Deleting everything we created
for temp,dc in objs_act.items():
    print("Testing DELETE {}".format(temp))
    for k,v in dc.items():
        num_tests += 1
        resp = requests.delete(base_url+'api/'+temp[:-len("_template")]+'s'+'/'+k.strip("\"\n"))
        check_request_good(resp)
        num_success += 1


# Do some GET requests to see if all of the data was deleted
for temp,dc in objs_act.items():
    print("Testing GET {}".format(temp))
    for k,v in dc.items():
        num_tests += 1
        resp = requests.get(base_url+'api/'+temp[:-len("_template")]+'s'+'/'+k.strip("\"\n"))
        
        check_request_good(resp)
        if clean_json(jsons.loads(resp.text)) == v:
            print("DATA STILL PRESENT")
        else:
            num_success += 1

print("Tests passed: {} out of {}".format(num_success, num_tests))