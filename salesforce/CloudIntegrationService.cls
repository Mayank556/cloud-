public class VercelIntegrationService {
    @future(callout=true)
    public static void pushDataToReactApp(String contactId) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        // Point this directly to your live Vercel Serverless Backend!
        request.setEndpoint('https://vercel-react-app-wheat.vercel.app/api/salesforce');
        request.setMethod('GET');
        
        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
                System.debug('Successfully synced Vercel and Salesforce Data! Payload: ' + response.getBody());
            } else {
                System.debug('Error communicating with Vercel Backend.');
            }
        } catch(Exception e) {
            System.debug('Callout error: ' + e.getMessage());
        }
    }
}
