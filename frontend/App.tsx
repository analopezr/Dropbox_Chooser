import React from "react";
import { useGlobalConfig, useSettingsButton } from "@airtable/blocks/ui";
import { useState } from "react";
import Settings from "./Settings";
import UpdateRecords from "./UpdateRecords";
import './App.scss';

const App = () => {

    const globalConfig = useGlobalConfig();
    const TABLE_ID = globalConfig.get('selectedTableId');
    const ASSET_FIELD_ID = globalConfig.get('selectedAssetFieldId');
    const ASSET_LINKS_FIELD_ID = globalConfig.get('selectedAssetLinkFieldId');
    const API_KEY = globalConfig.get('apiKey');

    const isAllSet = TABLE_ID && ASSET_FIELD_ID && ASSET_LINKS_FIELD_ID && API_KEY;

    // Show settings button
    const [isShowingSettings, setIsShowingSettings] = useState(false);
    useSettingsButton(function () {
        setIsShowingSettings(!isShowingSettings);
    });

    if (!isShowingSettings && !isAllSet) {
        setIsShowingSettings(true);
    }

    return (
        <div className="container-fluid">
            {isShowingSettings ? <Settings /> : <UpdateRecords />}
        </div>
    );
}

export default App;