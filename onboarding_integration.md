# Onboarding Form to Content Editor Integration

This document outlines how the onboarding form from the Self Cast Studios website integrates with the SelfCast Dynamic content editor system.

## Integration Overview

The onboarding form collects client information and sends it to an API endpoint, which then maps the form fields to the content editor fields and stores the data in Supabase using the existing data structure.

## Project ID Generation

Each client receives a unique project ID using the format:
```
lastname-firstname-YYYYMMDD-HHMM
```

For example: `smith-john-20250421-1545`

This ID is used as the primary identifier across both systems and provides:
- Easy client identification
- Chronological sorting capability
- Consistent reference point

## Data Flow

1. **Client completes onboarding form** on the Self Cast Studios website
2. **API endpoint processes form submission**:
   - Generates unique project ID
   - Maps form fields to content editor fields
   - Formats data for Supabase insertion
3. **Data is stored in Supabase** using the same structure as the content editor
4. **Content editor can access the data** using the project ID

## Field Mapping

The following fields from the onboarding form are mapped to the content editor:

| Onboarding Form Field | Content Editor Field |
|-----------------------|----------------------|
| fullName              | rendered_title       |
| email                 | email_address        |
| profession            | rendered_subtitle    |
| instagram             | instagram_url        |
| facebook              | facebook_url         |
| twitter               | twitter_url          |
| linkedin              | linkedin_url         |
| comfortableTopics     | rendered_bio_html    |
| writingStyle          | style_package        |
| colorPreference       | color_scheme         |
| title                 | professional_title   |
| successDefinition     | rendered_bio_html_card_1 |
| contentGoals          | rendered_bio_html_card_2 |
| challenges            | rendered_bio_html_card_3 |
| phone                 | contact_phone        |

## Data Structure

The data is stored in the `dynamic_content` table with the following structure:

```javascript
{
  project_id: "lastname-firstname-YYYYMMDD-HHMM",
  key: "field_name",
  value: "field_value"
}
```

## Implementation Details

### API Endpoint

The API endpoint is implemented in the Self Cast Studios repository at:
```
/app/api/onboarding/route.ts
```

### Supabase Connection

The integration uses the existing Supabase connection from the SelfCast Dynamic repository:
```javascript
const SUPABASE_URL = 'https://aqicztygjpmunfljjuto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs';
```

## Testing

To test the integration:
1. Complete the onboarding form on the Self Cast Studios website
2. Check the Supabase database for the new project
3. Open the content editor and verify the project appears in the dropdown
4. Confirm all mapped fields contain the correct data

## Future Enhancements

Potential future enhancements include:
- Email notifications when new clients complete the onboarding form
- Additional field mappings as needed
- Enhanced error handling and logging
- Automated site generation based on onboarding data
