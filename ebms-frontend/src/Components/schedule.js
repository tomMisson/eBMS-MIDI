import React, { Component } from 'react';
import Calendar from './calendar';

class Schedule extends Component {

    componentDidMount() {
        this.changeActiveNav();
    }

    changeActiveNav() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/schedule") {
                link.classList.add("navLinkActive");
            }
        });
    }

    render() { 
        return ( 
            <section id="schedule">
                <table class="scheduleTable">
                    <thead>
                        <tr class="schedule-header">
                            <td colspan="4">
                                <h3>Daily Schedule</h3>
                            </td>
                            <td colspan="3">
                            <button id="addEvent-btn">Add Event</button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    <tr id="daysOfWeekHeaders">
                        <th></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                    <tr>
                        <td>00</td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                    </tr>
                    <tr>
                        <td>01</td>
                    </tr>
                    <tr>
                        <td>02</td>
                    </tr>
                    <tr>
                        <td>03</td>
                    </tr>
                    <tr>
                        <td>04</td>
                    </tr>
                    <tr>
                        <td>05</td>
                    </tr>
                    <tr>
                        <td>06</td>
                    </tr>
                    <tr>
                        <td>07</td>
                    </tr>
                    <tr>
                        <td>08</td>
                    </tr>
                    <tr>
                        <td>09</td>
                    </tr>
                    <tr>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>11</td>
                    </tr>
                    <tr>
                        <td>12</td>
                    </tr>
                    <tr>
                        <td>13</td>
                    </tr>
                    <tr>
                        <td>14</td>
                    </tr>
                    <tr>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>16</td>
                    </tr>
                    <tr>
                        <td>17</td>
                    </tr>
                    <tr>
                        <td>18</td>
                    </tr>
                    <tr>
                        <td>19</td>
                    </tr>
                    <tr>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>21</td>
                    </tr>
                    <tr>
                        <td>22</td>
                    </tr>
                    <tr>
                        <td>23</td>
                    </tr>
                    <tr>
                        <td>24</td>
                    </tr>
                    </tbody>
                </table>
            </section>
         );
    }
}
 
export default Schedule;