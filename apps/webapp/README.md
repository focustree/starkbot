# Starkbot website

Manage your keys from that website.

### Dev setup

Install `npm` and `nodejs` packages according to your distribution.
create a *.env* file and add the following lines.

```
JWT_KEY = <KEY TO SIGN JWT TOKEN>
RST_KEY = <KEY TO SIGN THE RESET TOKEN>
API_URL = "http://localhost:3000/api"
```

Take care of choosing great keys.

Run `pnpm dev` in the webapp directory

Reach the website at `localhost:3000`