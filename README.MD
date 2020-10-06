# Andrea Vincenzo Abbondanza template for Nativescript

Hi, I love Nativescript and I'm adopting it for my Apps.
I've also have created a base project where we can start for every app we're building.

In this case, I've thought that it can be useful also for other people.

## What this template have

This template collect objects and stuff that we have found useful during our app development.

Lets see what we are talking about.

# How to use the template

Actually in the **app-root.xml** the default page points to home (template presentation and example page). You should point to **start** changing the default page in root.

The home page is only as example for the use of template functions.

### Install

```bash
tns create appname --template tns-template-ava-ts
```

#### NOTE: After NS6 update seems that tsconfig.json is not generated, I'm working on it, for now you should generate with tsc --init or copy from another porject

### Custom Model

We created a custom Model, the AvaModel that should be extended by all App models because it contains some utils stuff, like the **CopyFromObject** methods.

This method allows you to copy and create an object of type T and resolve the problem of json object to typescript object, see [this](https://www.andrewdev.eu/web/typescript-object-vs-javascript-object/) for more information.

Example:

```typescript
class Mytype extends AvaModel {
  public name: string = "";
  public surname: string = "";
  public get fullName() {
    return this.name + " " + this.surname;
  }
}

const json = { name: "Andrew", surname: "Keller" };

let myObject: MyType = object.assign(myObject, json);
console.log(myObject.fullName); // <--- throws error

let myObject1: MyType = new MyType().CopyFromObject<MyType>(json);
console.log(myObject1.fullName); // <--- works fine
```

### Custom View Model

We created a custom ViewModel, the AvaViewModel that should be extended by all App viewmodels because it contains some utils stuff, like **npc** function or the **TokenManager** (see Token Manager bottom).

#### npc

npc function is a short way to notify that property is changed to the interface.
For example:

```typescript
// set values
this.myProp = 2;
this.myProp1 = "Andrew";
this.myProp3 = false;

// classic notification changed
this.notifyPropertyChange("myProp", this.myProp);
this.notifyPropertyChange("myProp1", this.myProp1);
this.notifyPropertyChange("myProp2", this.myProp2);
// with npc

this.npc("myProp");
// or
this.npc(["myProp1", "myProp2"]);
```

You have also access to a **TokenManager** that is useful to manage jwt access tokens for the app. You will see how it works bottom.

### CSS

We have a class to manage CSS classes on view objects, I created this because is really useful for animations.

The class implements 4 methods:

- HasClass(_view_:**View**, _className_:**string**): check if _view_ has \__className_ in list
- AddClass(_view_:**View**, _className_:**string**): add the _className_ to object
- RemoveClass(_view_:**View**, _className_:**string**): remove the _className_ from object
- SwapClass(_view_:**View**, _className1_:**string**, _className2_:**string**): Execute a swap between two classes or add the first if none extists

### Errors

I've also introduced a type of **Error**, **AvaError** that can be used to create custom Errors.

The reason we don't simply extends the **Error** class is that the name and type will be always of the root error type. For example if I check the typeof or the name of **MyError** that extends **TypeError** the result will be always **TypeError**

In this case we can throw a custom error, like this:

```typescript
try {
  if (something) dostuff;
  else throw new AvaError("notSomething", "something is false");
} catch (err) {
  if (err.name === "notSomething") {
    console.log(err.message);
  }
}
```

in the **RestClient** section you can see also how to use better this way to manage errors.

### Config

It is just a file with global constants for api keys and stuff like this.

### Debugger

The debugger class is used to create logs that depends from a **Debugger** setting, in this way you can set it in production to **false** (I suggest you in the _app.ts_ file).

For example:

```typescript
Debugger.IsDebugOn = true;

Debugger.log("I work");

Debugger.IsDebugOn = false;

Debugger.log("You can't see me!");
```

### Timing

Another utils class is the Timing class that provides function for delays and intervals.

```typescript
// delay of 5000 ms
await Timing.delay(5000);
// timeout
await Timing.timeout(() => {
  dialogs.alert("5000 seconds passed");
}, 5000);
// repeat every second
let i = 0;
await Timing.repeat((handler: number) => {
  i++;
  if (i > 10) Timing.clearRepeat(handler);
}, 1000);
```

### User management via token

This template implements a system for user management via **jwt token** (more info [here](https://jwt.io/))
where our **payload** is the _IToken_ implmeneted interface:

```typescript
// Generic token interface
interface IToken {
  idUser: number;
  updated: string;
  created: string;
  expired: string;
  userName: string;
  email: string;
  // separated by commas
  types: string;
  // separated by commas
  claims: string;
}
// token implementation
export class Token implements IToken {
  public idUser: number = 0;
  public updated: string = "";
  public created: string = "";
  public expired: string = "";
  public userName: string = "";
  public email: string = "";
  public types: string = "";
  public claims: string = "";
}
```

you can extend token, but the **TokenManager** class needs the implementation of _IToken_ to works well.

The **TokenManager** class in fact needs, for some of its functions, of properties of _IToken_.

Let see how it works.

#### Token manager

The Token Manager works with **application settings** and has methods to load, unload, check roles/claims etc.

The most important methors are:

- setToken(_token_:**string**): set the token into local storage
- unsetToken(): delete the token from local storage
- loadLocalToken() -> **boolean** : load token and return true if loaded, false else

With this three methods we can manage the token's lifecycle in our app.

We also have:

- isAdmin(): you should customize this to map it with claims/types admin roles
- hasClaim(_claim_: **ClaimsTypes**): check if the claim is contained into the claims
- hasRole(_role_: **RolesTypes**): check if the role is contained into the types
- getTokenObject() -> **IToken**: return the direct IToken object

Let see an example of the token use:

```typescript
export class ViewModel extends AvaViewModel {
    constructor()
    {
        super();
    }

    public async pageLoaded()
    {
        // this load the token and return the response if the token has been loaded
        if(this.tManager.loadLocalToken())
        {
            if(this.tManager.isAdmin())
                // navigate to first admin page
            else
                if(this.tManager.hasRole(RolesTypes.U1))
                    // navigate to user page
                else
                    // navigate to login with unauthorized message
        }
        else
        {
            // navigate to login page
        }
    }
}
```

An example of login

```typescript
public async onLoginTap(args: EventData){
    try
    {
        const client = new RestClient();
        const request = await client.GET(this.apiLoginUrl);
        const token = request.toStandardResponseData<Token>().data;
        // set token, from now we can load it
        this.tManager.setToken(token);
        this.tManager.loadLocalToken();
    }
    catch(err)
    {
        console.log(err);
    }
}
```

### Rest Client

I came from .NET (and I still love it) and I'm using on it the [DewRestClient](https://github.com/andreabbondanza/RESTClient) for web requests.

For Nativescript I've created a simil (but with less functions for now) library for the Rest Client.

My first approach is about the response. All my API works with this type of response

```typescript
export default class StandardResponse<T> {
  public data: T;
  public errorMessage!: string;
  public error: StandardError = new StandardError();
}

class StandardError {
  public desc: string = "";
  public number: number = 0;
}
```

And actually I use two types of Error for this client:

```typescript
export enum RestClientErrors {
  HttpError = "HttpError",
  HttpErrorM = "HttpErrorM",
}

export class HttpError extends AvaError {
  public constructor(resp: RestResponse<HttpResponse>) {
    super(RestClientErrors.HttpError, resp.Response.statusCode.toString());
    this.response = resp;
  }
  public response: RestResponse<HttpResponse>;
}

export class HttpErrorM extends AvaError {
  public constructor(resp: RestResponse<TNSHttpFormDataResponse>) {
    super(RestClientErrors.HttpErrorM, resp.Response.statusCode.toString());
    this.response = resp;
  }
  public response: RestResponse<TNSHttpFormDataResponse>;
}
```

The enum is useful when you need to catch the error, you can see this in the following example (same code of example page of template):

```typescript
public async onRestRequestTap(args: EventData)
{
    if (this._restItems.length < 5)
    {
        try
        {
            const client = new RestClient();
            // resp is RestResponse type
            const resp = await client.GET("https://jsonplaceholder.typicode.com/todos/" + (this._restItems.length + 1));
            // result is StandardResponse<HomeItem> type
            const result = resp.toStandardResponseData<HomeItem>();
            Debugger.log(result);
            this._restItems.push(result.data);
            this.npc("restItems");
        }
        catch (error)
        {
            if (error.name === RestClientErrors.HttpError)
            {
                const e = error as HttpError;
                Debugger.log(e.message);
                dialogs.alert(e.message);
            }
        }
    }
    else
    {
        dialogs.alert("Items ended");
    }
}
```

This code show how make a GET request with the **RestClient**.

The steps are simply, you create a client, you make the request (you can also pass headers).

After this, you have the **RestResponse** object and now you can use two functions:

- toStandardResponseData<T>(): return a **StandardResponse** with the result of request is assigned as T into the data property
- toStandardRepsonse<T>(): return a **StandardResponse** created by the result of the request (the server return to us a StandardResponse like object)

#### Multipart form data

Actually this RestClient implements a **POST** method from the Nativescript library and a **POST MULTIPART FORM DATA** by the library [nativescript-http-formdata](https://github.com/dotnetdreamer/nativescript-http-formdata).

The **RestResponse** is of type T (TNSHttpFormDataResponse or HttpResponse) and you can access to response via **response** property.

When you use the toStandardResponse/Data method this is transparent.

## Note

Actually the template install by default the [dewlinq](https://github.com/andreabbondanza/dewlinq) and [dewstrings](https://github.com/andreabbondanza/dew-strings) libraries.
