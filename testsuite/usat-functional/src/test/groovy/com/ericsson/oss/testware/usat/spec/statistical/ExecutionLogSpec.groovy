/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2017
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/

package com.ericsson.oss.testware.usat.spec.statistical

import com.ericsson.oss.testware.usat.page.object.ExecutionLogPage
import com.ericsson.oss.testware.usat.page.object.DecisionRulesPage
import com.ericsson.oss.testware.usat.spec.BaseSpecification
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.junit.runner.RunWith
import spock.lang.Stepwise

import org.openqa.selenium.support.FindBy
import static com.ericsson.oss.testware.usat.page.fragment.ActionBar.CREATE_DECISION_RULE_BUTTON
import static com.ericsson.oss.testware.usat.page.fragment.ActionBar.DELETE_DECISION_RULE_BUTTON
import static com.ericsson.oss.testware.usat.page.fragment.ActionBar.EDIT_DECISION_RULE_BUTTON
import static com.ericsson.oss.testware.usat.page.fragment.ActionBar.ACTIVATE_DECISION_RULE_BUTTON
import static com.ericsson.oss.testware.usat.page.fragment.ActionBar.DEACTIVATE_DECISION_RULE_BUTTON
import static com.ericsson.oss.testware.usat.page.fragment.DialogBox.Save_Decision_Rule
import static com.ericsson.oss.testware.usat.page.fragment.SystemBar.LOGOUT_BUTTON

@Stepwise
@RunWith(ArquillianSputnik)
class ExecutionLogSpec extends BaseSpecification {
    final String EXECUTIONLOG_PAGE = "#sap-execution-log"
    final String DECISIONRULES_PAGE = "#sap-execution-log/sap-decision-rules"
    final String DECISION_RULES_DIALOG = "Create Decision Rule"
    
    @Page
    ExecutionLogPage executionLogPage
    
    @FindBy(css = ".eaContainer-applicationHolder")
    DecisionRulesPage decisionRulesPage

    def 'WHEN started, THEN Execution Log page shown with Legal Notice Dialog'() {
        when:
            open(executionLogPage)
        then:
            executionLogPage.isLegalNoticeDisplayed() == true
            executionLogPage.isLegalNoticeHeaderDisplayed() == true
            browser.currentUrl.endsWith(EXECUTIONLOG_PAGE)
    }

    def 'WHEN Legal Notice button clicked, THEN Legal Notice removed'() {
        when:
            executionLogPage.clickLegalNoticeOKButton()
        then:
            executionLogPage.isLegalNoticeDisplayed() == false
            browser.currentUrl.endsWith(EXECUTIONLOG_PAGE)
    }

    def 'WHEN decision rules drop down item is clicked, THEN Decision Rules Page is displayed'() {
        given:
            browser.currentUrl.endsWith(EXECUTIONLOG_PAGE)
        when:
            executionLogPage.isExecutionLogHeaderDisplayed() == true
            executionLogPage.isCreationDateDisplayed() == true
            executionLogPage.clickBreadcrumbDropDown()
            executionLogPage.clickBreadcrumbDropDownItem()
        then:
            browser.currentUrl.endsWith(DECISIONRULES_PAGE)
    }

    def 'WHEN an inactive decision rule entry is selected THEN options to Delete, Edit and Activate are displayed'() {

        when:
            decisionRulesPage.isActionButtonDisplayed(CREATE_DECISION_RULE_BUTTON) == true
            decisionRulesPage.isActionButtonDisplayed(DELETE_DECISION_RULE_BUTTON) == false
            decisionRulesPage.isActionButtonDisplayed(EDIT_DECISION_RULE_BUTTON) == false
            decisionRulesPage.isActionButtonDisplayed(ACTIVATE_DECISION_RULE_BUTTON) == false
            decisionRulesPage.selectStatus()
            decisionRulesPage.selectStatus()
            decisionRulesPage.selectFirstCheckbox()
        then:
            decisionRulesPage.isActionButtonDisplayed(CREATE_DECISION_RULE_BUTTON) == false
            decisionRulesPage.isActionButtonDisplayed(DELETE_DECISION_RULE_BUTTON) == true
            decisionRulesPage.isActionButtonDisplayed(EDIT_DECISION_RULE_BUTTON) == true
            decisionRulesPage.isActionButtonDisplayed(ACTIVATE_DECISION_RULE_BUTTON) == true
    }

    def 'WHEN an inactive decision rule is selected THEN Delete that decision rule'(){
        when:
            decisionRulesPage.isActionButtonDisplayed(DELETE_DECISION_RULE_BUTTON) == true
            decisionRulesPage.actionBarButtonClick(DELETE_DECISION_RULE_BUTTON)
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.clickOkButton()
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

    def 'WHEN an inactive decision rule is selected THEN Activate that decision rule'(){
        when:
            decisionRulesPage.selectFirstCheckbox()
            decisionRulesPage.isActionButtonDisplayed(ACTIVATE_DECISION_RULE_BUTTON) == true
            decisionRulesPage.actionBarButtonClick(ACTIVATE_DECISION_RULE_BUTTON)
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.clickOkButton()
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

    def 'WHEN the Create Button is selected THEN a new Decision Rule Dialog Box is displayed'() {

        when:
            decisionRulesPage.actionBarButtonClick(CREATE_DECISION_RULE_BUTTON)
        then:
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.getDialogBoxHeader() == DECISION_RULES_DIALOG
    }

    def 'WHEN the Decision Rules Dialog Box is open THEN a new PM Decision Rule can be created '() {

        when:
            decisionRulesPage.getDialogBoxHeader() == DECISION_RULES_DIALOG
            decisionRulesPage.createPmDecisionRule()
            decisionRulesPage.clickDialogBoxButton(Save_Decision_Rule)
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

    def 'WHEN an active COMM Decision Rule is selected THEN it is deactivated and deleted'() {

        when:
            decisionRulesPage.selectAssetType()
            decisionRulesPage.selectFirstCheckbox()
            decisionRulesPage.isActionButtonDisplayed(DEACTIVATE_DECISION_RULE_BUTTON) == true
            decisionRulesPage.ActionBarClickDeactivate()
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.clickOkButton()
            decisionRulesPage.isActionButtonDisplayed(DELETE_DECISION_RULE_BUTTON) == true
            decisionRulesPage.actionBarButtonClick(DELETE_DECISION_RULE_BUTTON)
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.clickOkButton()
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

    def 'WHEN the Decision Rules Dialog Box is open THEN a new COMM Decision Rule can be created '() {

        when:
            decisionRulesPage.actionBarButtonClick(CREATE_DECISION_RULE_BUTTON)
            decisionRulesPage.createCommDecisionRule()
            decisionRulesPage.clickActivateButton()
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

    def 'WHEN an inactive decision rule is selected THEN Edit that decision rule and save'(){
        when:
            decisionRulesPage.selectStatus()
            decisionRulesPage.selectStatus()
            decisionRulesPage.selectFirstCheckbox()
            decisionRulesPage.isActionButtonDisplayed(EDIT_DECISION_RULE_BUTTON) == true
            decisionRulesPage.actionBarButtonClick(EDIT_DECISION_RULE_BUTTON)
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.editPmDecisionRule()
            decisionRulesPage.clickDialogBoxButton(Save_Decision_Rule)
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

    def 'WHEN the VNF Asset Type is selected THEN a Decision Rule with Log Only and Scale out actions can be created'(){
        when:
            decisionRulesPage.actionBarButtonClick(CREATE_DECISION_RULE_BUTTON)
            decisionRulesPage.isDialogBoxDisplayed() == true
            decisionRulesPage.createFmDecisionRule()
            decisionRulesPage.clickActivateButton()
        then:
            decisionRulesPage.isDialogBoxDisplayed() == false
    }

}
