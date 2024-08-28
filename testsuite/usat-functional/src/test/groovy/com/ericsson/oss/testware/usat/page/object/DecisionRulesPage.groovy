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

package com.ericsson.oss.testware.usat.page.object

import com.ericsson.oss.testware.usat.page.fragment.ActionBar
import com.ericsson.oss.testware.usat.page.fragment.SystemBar
import com.ericsson.oss.testware.usat.page.fragment.ExecutionLog
import com.ericsson.oss.testware.usat.page.fragment.BreadCrumbs
import com.ericsson.oss.testware.usat.page.fragment.DialogBox
import com.ericsson.oss.testware.usat.page.fragment.DecisionRulePanel
import com.ericsson.oss.testware.usat.page.fragment.Table
import org.jboss.arquillian.graphene.page.Location
import org.openqa.selenium.support.FindBy

@Location("/#sap-execution-log/sap-decision-rules")
class DecisionRulesPage implements PageObject {

    @FindBy(xpath = "//*[@class='ebDialogBox']")
    DialogBox dialogBox
    
    @FindBy(css = ".ebBreadcrumbs-link")
    BreadCrumbs breadCrumbs
    
    @FindBy(css = ".elTablelib-Table-body")
    Table tablebody
    
    @FindBy(css = ".elTablelib-Table")
    DecisionRulePanel decisionRulePanel

    @FindBy(css = ".elLayouts-QuickActionBarWrapper")
    ActionBar actionBar
    
    @FindBy(css = ".eaSapExecutionLog-rList-gridHolder")
    ExecutionLog executionLog
    
    @FindBy(css = ".eaContainer-SystemBarHolder")
    SystemBar systemBar

    @Override
    void waitForLoad() {
        decisionRulePanel.waitForLoad()
    }
    
    boolean isDialogBoxDisplayed() {
        pause()
        return dialogBox.isDialogBoxHolderDisplayed()
    }
    
    boolean isActionButtonDisplayed(final String buttonText) {
        pause()
        return actionBar.isButtonDisplayed(buttonText)
    }

    String getDialogBoxHeader() {
        return dialogBox.getDialogBoxHeader()
    }
    
    String clickDialogBoxButton(final String buttonText) {
        return dialogBox.clickDialogBoxButton(buttonText)
    }
    
    String actionBarButtonClick(final String buttonText) {
        return actionBar.clickActionBarButton(buttonText)
    }
    
    String ActionBarClickDeactivate() {
        pauseActivate()
        return actionBar.clickDeactivateButton()
    }
    
    String selectFirstCheckbox() {
        return decisionRulePanel.clickFirstCheckbox()
    }
    
    String selectStatus() {
        decisionRulePanel.waitForLoad()
        return decisionRulePanel.clickStatus()
    }
    
    String selectAssetType() {
        return decisionRulePanel.clickAssetType()
    }
    
    String createPmDecisionRule() {
        return dialogBox.createPmDecisionRule("TestTenant", "cpu_util")
    }
    
    String editPmDecisionRule() {
        return dialogBox.editPmDecisionRule("3", "60")
    }
    
    String createCommDecisionRule() {
        return dialogBox.createCommDecisionRule()
    }
    
    String clickOkButton() {
        return dialogBox.clickOk()
    }
    
    String clickActivateButton() {
        return dialogBox.clickActivate()
    }
    
    String clickSaveButton() {
        return dialogBox.clickSave()
    }

    String systemBarButtonClick(final String buttonText) {
        return systemBar.clickSystemBarButton(buttonText)
    }

    String clickLogOutButton() {
        return dialogBox.clickLogOut()
    }

    String createFmDecisionRule() {
        return dialogBox.createFmDecisionRule("DO_Tenant", "disk_util", "2", "45")
    }

    void println() {
    }

    synchronized void pause() {
        wait(7000)
    }

    synchronized void pauseActivate() {
        wait(10000)
    }
}
