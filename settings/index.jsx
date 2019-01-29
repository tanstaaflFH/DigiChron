function mySettings (props) {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">Features</Text>
        }>
        <Toggle
          settingsKey="hasHRScreen"
          label="Dedicated HR screen"
        />
        <Text>If you switched between custom and standard heart rate zones, you can reset the display here if necessary.</Text>
        <Button
          label="Reset heart rate zones"
          onClick={() => props.settingsStorage.setItem('hrReset', "true")}
        />
      </Section>
      <Section
        title={
          <Text bold align="center">Format</Text>
        }>
        <Select
          label={"Date"}
          settingsKey="dateFormat"
          options={[
            {name:"d.m.yyyy", value:"1"},
            {name:"m/d/yyyy", value:"2"},
            {name:"d/m/yyyy", value:"3"},
            {name:"yyyy.m.d", value:"4"},
            {name:"yyyy/m/d", value:"5"}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
