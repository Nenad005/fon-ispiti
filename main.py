import requests

with requests.get("https://oas.fon.bg.ac.rs/raspored-kolokvijuma/") as r:
    with open("test.html", 'wb') as f:
        f.write(r.content)
    print(r.content)