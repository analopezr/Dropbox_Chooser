import { base } from '@airtable/blocks';
import { FieldType } from '@airtable/blocks/models';
import { FieldPickerSynced, FormField, Input, TablePickerSynced, useGlobalConfig } from '@airtable/blocks/ui';
import React from 'react'; 
import { Card, Tab, Tabs } from 'react-bootstrap';
import './Settings.scss';
import Header from './Header';

const Settings = () => {
    const globalConfig = useGlobalConfig();

    const tableId = globalConfig.get('selectedTableId') as string;
    const tableAssetsId = globalConfig.get('selectedTableAssetsId') as string;
    const table = base.getTableByIdIfExists(tableId);
    const tableAssets = base.getTableByIdIfExists(tableAssetsId);

    return (
        <>
            <Header />
            <Tabs defaultActiveKey="configuration" className="configuration-tabs">
                <Tab eventKey="configuration" title="Configuration">
                    <Card className="configuration">
                        <FormField label="Table">
                            <TablePickerSynced globalConfigKey="selectedTableId" />
                        </FormField>
                        <FormField label="Assets Table">
                            <TablePickerSynced globalConfigKey="selectedTableAssetsId" />
                        </FormField>
                        {table?.id && tableAssets?.id? <>
                        <FormField label="Asset Name Field" marginBottom={0}>
                            <FieldPickerSynced
                                table={tableAssets}
                                globalConfigKey="selectedAssetNameFieldId"
                                placeholder="Pick the Name field for your assets"
                                allowedTypes={[FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT, FieldType.URL]}
                            />
                        </FormField>
                        <FormField label="Asset File Field" marginBottom={0}>
                            <FieldPickerSynced
                                table={tableAssets}
                                globalConfigKey="selectedAssetFileFieldId"
                                placeholder="Pick the Attachment field for your assets"
                                allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS]}
                            />
                        </FormField>
                        <FormField label="Asset Link Field" marginBottom={0}>
                            <FieldPickerSynced
                                table={tableAssets}
                                globalConfigKey="selectedAssetLinkFieldId"
                                placeholder="Pick the URL field for your asset link"
                                allowedTypes={[FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT, FieldType.URL]}
                            />
                        </FormField>
                        <FormField label="Asset Record Link Field" marginBottom={0}>
                            <FieldPickerSynced
                                table={tableAssets}
                                globalConfigKey="selectedAssetLinkedFieldId"
                                placeholder="Pick the record link field for your assets"
                                allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                            />
                        </FormField>
                        <FormField label="Dropbox API Key" marginBottom={0}>
                            <Input
                                type="password"
                                value={globalConfig.get('apiKey') as string}
                                onChange={event => globalConfig.setAsync('apiKey', event.target.value)}
                            />
                        </FormField>
                        </> : null}
                    </Card>
                </Tab>
                <Tab eventKey="about" title="About">
                    <Card className="configuration">
                        <p>An extension to choose files from Dropbox.</p>
                    </Card>
                </Tab>
                <Tab eventKey="license" title="License">
                    <Card className="configuration">
                        &copy; {new Date().getFullYear()} InAir Studio
                    </Card>
                </Tab>
            </Tabs>
        </>
    )
}

export default Settings;
