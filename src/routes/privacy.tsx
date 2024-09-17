import React from 'react';
import styled, { css } from 'styled-components';


const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 80vh;
  width: 100%;
  overflow: auto;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 20px;

  > p {
    text-align: left;
  }
`;

const Privacy = () => {
  return (
    <Wrapper>
      <Container>
        <h1>Privacy Policy</h1>
        <p>
        Updated September 17, 2024
        </p>
        <Section>
          <h3>1. Personal information we collect</h3>
          <p>The only information we collect that may be personal is the name you specify when you fill out the form before starting or joining a session. This can be modified in Preferences {'>'} General.</p>
        </Section>
        <Section>
          <h3>
          2. How we use the information we collect
          </h3>
          <p>
            No data is ever nor will ever be shared with third parties for marketing purposes. Any personal information collected is used only for the website&apos;s function, namely to help other session participants identify votes you cast on any issue estimation. This is accomplished by storing the data in each session data collection (identified as a &quot;room&quot;) within our data storage system, Firebase.
          </p>

          <p>
            Firebase is owned by Google. You can read their privacy policy at <a href="https://policies.google.com/privacy" target='_blank' rel="noreferrer">https://policies.google.com/privacy</a> and Firebase&apos;s privacy documentation at <a href="https://firebase.google.com/support/privacy/" target='_blank' rel="noreferrer">https://firebase.google.com/support/privacy/</a>.
          </p>
        </Section>
        <Section>
          <h3>
          3. Third-Party Integrations
          </h3>
          <p>
            Currently, the only integration available to Pointy Poker users is for Jira. This connection is facilitated through Atlassian&apos;s Oauth 2.0 (3LO) system. Authorization tokens, refresh tokens, or anything related to your Jira account are stored in Local Storage and are only accessible by pages on pointypoker.dev. Furthermore, any said information is not used for any purpose other than reading and writing board, sprint, issue, or field data in Jira.
          </p>
          <p>
            No personally identifiable data is intentionally downloaded through this integration, although ticket summaries may contain PII. If you find a ticket summary that contains PII, you can report it which will purge the data from the database.
          </p>
        </Section>
        <Section>
          <h3>
          4. Data Life
          </h3>
          <p>
          A Time To Live (TTL) policy is in place to delete data older than one month. If you may contact the owner of Pointy Poker to request data erasure.
          </p>
        </Section>
        <Section>
          <h3>
          5. Security
          </h3>
          <p>
          While no organization can guarantee perfect security, we are continuously implementing and updating administrative, technical, and physical security measures to help protect your information against unlawful or unauthorized access, loss, destruction, or alteration. As it stands, data stored in Firebase is encrypted at rest.
          </p>
        </Section>
        <Section>
          <h3>
          6. Changes to this policy
          </h3>
          <p>
          We reserve the right to modify this Privacy Policy at any time in accordance with applicable law. If we do so, update this page and the &quot;Updated&quot; date at the top.
          </p>
        </Section>
        <Section>
          <h3>
          7. Contact
          </h3>
          <p>
          For questions or complaints about this Privacy Policy or Pointy Poker&apos;s handling of personal information, please contact the owner of the Pointy Poker repository on GitHub&apos;s website, found at https://github.com/mashdots/pointypoker.
          </p>
        </Section>
      </Container>
    </Wrapper>
  );
};

export default Privacy;
