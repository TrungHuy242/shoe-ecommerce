import pyodbc
conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=TRUNGHUY;"
    "DATABASE=shoe_db;"
    "UID=sa;"
    "PWD=123456"
)
conn = pyodbc.connect(conn_str)
print("Kết nối thành công!")
conn.close()