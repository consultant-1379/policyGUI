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

class ExecutionLog implements PageFragment, WaitAbility {
    
    @FindBy(css = ".elTablelib-lTableHeader-title")
    WebElement title

    @FindBy(css = ".eaSapExecutionLog-wCopyrightNotice-inner")
    WebElement legalNoticeBox

    @FindBy(xpath = "//*[text() ='OK']")
    WebElement ok

    @FindBy(xpath = "//*[text() ='IMPORTANT LEGAL NOTICE']")
    WebElement legalNoticeHeader

    @FindBy(xpath = "(//*[text() ='Execution Log'])[4]")
    WebElement executionLogHeader

    @FindBy(xpath = "(//*[text() ='Creation Date'])[1]")
     WebElement creationDate

    @Override
    void waitForLoad() {
        waitVisible(legalNoticeHeader)
    }

    private String getButtonSelector(final String buttonText) {
        return "//*[text()='"+ buttonText + "']"
    }

    boolean legalNoticeHeader(final String buttonText) {
        final String buttonSelector = getButtonSelector(buttonText)
        try {
            WebElement licenceButton = root.findElement(By.xpath(buttonSelector))
            return licenceButton.isDisplayed()
        } catch (NoSuchElementException e) {
            return false
        }
    }

    boolean legalNoticeBoxDisplayed() {
        try {
            return legalNoticeBox.isDisplayed()
        } catch (Exception e) {
            return false;
        }
    }

    boolean legalNoticeHeaderDisplayed() {
        try {
            return legalNoticeHeader.isDisplayed()
        } catch (Exception e) {
            return false;
        }
    }

    boolean executionLogHeaderDisplayed() {
        try {
            return executionLogHeader.isDisplayed()
        } catch (Exception e) {
            return false;
        }
    }

    boolean creationDateDisplayed() {
        try {
            return creationDate.isDisplayed()
        } catch (Exception e) {
            return false;
        }
    }
    
    void clickOKButton() {
        click(ok)
    }

}
