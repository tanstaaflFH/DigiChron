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
            {name:"d/m/yyyy", value:"3"}
          ]}
        />
      </Section>
      <Section
        title={
          <Text bold align="center">Other</Text>
        }>
        <Button
          label="Reset heart rate zones"
          onClick={() => props.settingsStorage.setItem('hrReset', "true")}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);