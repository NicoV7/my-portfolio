


def maxDistToClosest( seats) -> int:
    #numPerson = sum()
    prevPerson = -1
    res = 0
       
    for i in range(len(seats)):
        if seats[i]:
            dist = i if prevPerson == -1 else (i - prevPerson)//2
            res = max(res, dist)
            prevPerson = i
    if not seats[i]:
        res = max(res, (i - prevPerson))
    return res
    
# i = 0 
# prev = 0
# res = 0 , 0

# i = 1
# res = 1

#...i = 4
# res 3 
seats = [0,0,0, 0, 1]        
print(maxDistToClosest(seats = 
seats))

        
            

                