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

package com.ericsson.oss.testware.usat.page.fragment

import com.ericsson.oss.testware.usat.page.ability.WaitAbility
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy
import org.openqa.selenium.By

class DialogBox implements WaitAbility, PageFragment {

    static final String Save_Decision_Rule = 'Save'
    static final String OK = 'OK'

    @FindBy(css = ".ebDialog-holder")
    WebElement dialogBoxHolder

    @FindBy(css = ".ebDialogBox-primaryText")
    WebElement dialogBoxHeader

    @FindBy(css = ".ebDialogBox-secondaryText")
    WebElement secondaryText

    @FindBy(xpath = "//span[text() ='Save']")
    WebElement saveButton

    @FindBy(xpath = "//span[text() ='Cancel']")
    WebElement cancelButton

    @FindBy(xpath = "//input[@placeholder='xyz*, abc*']")
    WebElement txtBox_TenantName

    @FindBy(xpath = "//input[@placeholder='cpu*, disk*']")
    WebElement txtBox_MeterName

    @FindBy(xpath = "(//input[@class='ebInput ebInput_width_full'])[7]")
    WebElement txtBox_EditActionCount

    @FindBy(xpath = "(//input[@class='ebInput ebInput_width_full'])[8]")
    WebElement txtBox_EditTimeLapse

    @FindBy(xpath = "//span[@class='ebSelect-value' and text() = 'Please select ...']")
    WebElement altActionDropDown

    @FindBy(xpath = "//span[text()='No Alternative Action']")
    WebElement editAltActionDropDown

    @FindBy(xpath = "//div[text()='recreate']")
    WebElement recreateDropDownOption

    @FindBy(xpath = "//span[@class='ebSelect-value' and text() ='PM']")
    WebElement eventTypeDropDown

    @FindBy(xpath = "//*[text()='COMM']")
    WebElement commDropDownOption

    @FindBy(xpath = "//*[text()='FM']")
    WebElement fmDropDownOption

    @FindBy(xpath = "//span[@class='ebSelect-value' and text() ='VM']")
    WebElement assetTypeDropDownOption

    @FindBy(xpath = "//*[text()='VNF']")
    WebElement vnfDropDownOption

    @FindBy(xpath = "//span[@class='ebSelect-value' and text() ='scaleIn']")
    WebElement actionDropDownOption

    @FindBy(xpath = "//div[text()='logOnly']")
    WebElement logOnlyActionOption

    @FindBy(xpath = "//*[@data-path='alternateAction.primaryActionCount']//input[@class='ebInput ebInput_width_full']")
    WebElement txtBox_CreateActionCount

    @FindBy(xpath = "//*[@data-path='alternateAction.timeLapse']//input[@class='ebInput ebInput_width_full']")
    WebElement txtBox_CreateTimeLapse

    @FindBy(xpath = "//div[text()='scaleOut']")
    WebElement scaleOutDropDownOption

    @FindBy(xpath = "//*[text() ='OK']")
    WebElement ok

    @FindBy(xpath = "//span[@class='ebBtn-caption' and text() ='Activate']")
    WebElement activate

    @FindBy(xpath = "//span[@class='ebBtn-caption' and text() ='Log Out']")
    WebElement logOutButton

    String getDialogBoxHeader() {
        return dialogBoxHeader.getText()
    }

    String getSecondaryText() {
        return secondaryText.getText()
    }

    void clickOk() {
        pause()
        click(ok)
    }
    
    void clickSave() {
        click(saveButton)
    }
    
    void clickActivate() {
        click(activate)
    }

    boolean isDialogBoxHolderDisplayed() {
        try {
            return dialogBoxHeader.isDisplayed()
        } catch (Exception e) {
            return false;
        }
    }

    private String getButtonSelector(final String buttonText) {
        return "//span[text()='"+ buttonText + "']"
    }

    void clickDialogBoxButton(final String buttonText) {
        final String buttonSelector = getButtonSelector(buttonText)
        WebElement dialogBoxButton = root.findElement(By.xpath(buttonSelector))
        waitForLoad()
        click(dialogBoxButton)
    }

    @Override
    void waitForLoad() {
        waitVisible(cancelButton)
    }

    void waitForDialogBox() {
        waitVisible(okButton)
    }

    void clickCancelButton() {
        click(cancelButton)
    }

    void alternativeActionDropDownItem(){
        click(altActionDropDown)   
    }
    
    void editAlternativeActionDropDownItem(){
        pause()
        click(editAltActionDropDown)
    }
    
    void clickRecreateFromDropDown() {
        click(recreateDropDownOption)
    }
    
    void createPmDecisionRule(final String tenantName, final String meterName) {
        txtBox_TenantName.sendKeys(tenantName)
        txtBox_MeterName.sendKeys(meterName)
    }
    
    void eventTypeDropDown(){
        pause()
        eventTypeDropDown.click()   
    }
    
    void clickCommFromDropDown() {
        click(commDropDownOption)
    }

    void createCommDecisionRule() {
        eventTypeDropDown()
        clickCommFromDropDown()
    }

    void editPmDecisionRule(final String actionCount, final String timeLapse) {
        txtBox_EditActionCount.sendKeys(actionCount)
        txtBox_EditTimeLapse.sendKeys(timeLapse)
        editAlternativeActionDropDownItem()
        clickRecreateFromDropDown()
    }

    void createFmDecisionRule(final String tenantName, final String meterName, final String actionCount, final String timeLapse) {
        changeEventTypeToFM()
        changeAssetTypeToVNF()
        txtBox_TenantName.sendKeys(tenantName)
        txtBox_MeterName.sendKeys(meterName)
        changeActionToLogOnly()
        txtBox_CreateActionCount.sendKeys(actionCount)
        txtBox_CreateTimeLapse.sendKeys(timeLapse)
        changeAltActionToScaleOut()
    }

    void changeEventTypeToFM(){
        eventTypeDropDown()
        selectFmOption()
    }

    void selectFmOption() {
        click(fmDropDownOption)
        pause()
    }

    void changeAssetTypeToVNF(){
        assetTypeDropDown()
        selectVNFOption()
    }

    void assetTypeDropDown(){
        pause()
        assetTypeDropDownOption.click()
    }

    void selectVNFOption() {
        click(vnfDropDownOption)
        pause()
    }

    void changeActionToLogOnly(){
        actionDropDown()
        selectLogOnlyOption()
    }

    void selectLogOnlyOption() {
        click(logOnlyActionOption)
        pause()
    }

    void changeAltActionToScaleOut(){
        alternativeActionDropDownItem()
        selectScaleOutOption()
    }

    void actionDropDown(){
        pause()
        actionDropDownOption.click()
    }

    void selectScaleOutOption() {
        click(scaleOutDropDownOption)
        pause()
    }

    void clickLogOut() {
        click(logOutButton)
    }

    synchronized void pause() {
        wait(5000)
    }
}
