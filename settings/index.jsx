function mySettings (props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">General Settings</Text>}>
        <Toggle
          settingsKey="hasHRScreen"
          label="Dedicated HR screen"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);