import pandas as pd

values = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
index = ['one', 'two', 'three']
colums = ['A', 'B', 'C']

df = pd.DataFrame(values, index=index, colums = colums)
print(df)