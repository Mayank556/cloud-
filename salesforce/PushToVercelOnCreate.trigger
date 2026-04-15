trigger PushToVercelOnCreate on Contact (after insert, after update) {
    for (Contact newContact : Trigger.new) {
        // Every time a user types a new Contact name into Salesforce...
        // Salesforce will INSTANTLY fire an internet payload to your Vercel React database!
        VercelIntegrationService.pushDataToReactApp(newContact.Id);
    }
}
