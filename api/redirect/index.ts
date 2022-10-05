import { AzureFunction, Context, HttpRequest } from "@azure/functions"

/**
 * FAKE function for simulating my api
 * @param to short url (5 chars long) to look in the CosmosDB container
 * @param auth0domain 
 * @returns 
 */
const getLongUrl = (to :string,auth0domain:string):Promise<{value:string}>=>{
    return new Promise<{value:string}>((resolve) => {resolve({value:'https://github.com/Azure/static-web-apps-cli/issues/580'})})
}
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const _to = (req.query.to || (req.body && req.body.to as string));
    let to = _to ? _to : context.bindingData.link
    if (_to) {
        to = _to
    }else if (context.bindingData.link){
        to = context.bindingData.link
    }else if (req.headers["x-ms-original-url"]){
        const originalUrl = new URL (req.headers["x-ms-original-url"])
        to = originalUrl.pathname.substring(2) // remove /!
    }
    try{
        console.log(`to:${to}`)
        const longUrl = (await getLongUrl(to,'')).value
        console.log(`redirect to: ${longUrl}`)
        context.res = {
            status:302,
            headers: { "location": longUrl }
        }
    }
    catch(error){
        context.res = {
            status:500,
            body: error
        }
    }

};

export default httpTrigger;