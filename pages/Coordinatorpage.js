import React, { useState } from 'react';
import { HeaderScripts, BodyScripts } from '../components/Compiled_scripts';
import Head from "next/head";

const Homepage = () => {

    function Goback() {
        window.location.href = '/'; 
    }

    return (
    <div>
        <Head>
            <title>SRCB AVR | Coordinator</title>

            <link href="admin_assets/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"/>

            <link href="assets/css/googlefont.css" rel="stylesheet" />

            <link href="admin_assets/css/sb-admin-2.css" rel="stylesheet"/>
        </Head>

        <main className="main" id="index-page">

        {/* Page Wrapper */}
        <div id="wrapper">
            {/* Sidebar */}
            <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
            >
            {/* Sidebar - Brand */}
            <a
                className="sidebar-brand d-flex align-items-center justify-content-center"
                href="index.html"
            >
                <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink" />
                </div>
                <div className="sidebar-brand-text mx-3">
                SB Admin <sup>2</sup>
                </div>
            </a>
            {/* Heading */}
            <div className="sidebar-heading">Interface</div>
            <hr className="sidebar-divider" />
            {/* Nav Item - Dashboard */}
            <li className="nav-item active">
                <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt" />
                <span>Dashboard</span>
                </a>
            </li>
            {/* Nav Item - Charts */}
            <li className="nav-item">
                <a className="nav-link" href="charts.html">
                <i className="fas fa-fw fa-chart-area" />
                <span>Charts</span>
                </a>
            </li>
            {/* Nav Item - Tables */}
            <li className="nav-item">
                <a className="nav-link" href="tables.html">
                <i className="fas fa-fw fa-table" />
                <span>Tables</span>
                </a>
            </li>
            <br />
            {/* Divider */}
            <hr className="sidebar-divider d-none d-md-block" />
            {/* Sidebar Toggler (Sidebar) */}
            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle" />
            </div>
            </ul>
            {/* End of Sidebar */}
            {/* Content Wrapper */}
            <div id="content-wrapper" className="d-flex flex-column">
            {/* Main Content */}
            <div id="content">
                {/* Topbar */}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* Sidebar Toggle (Topbar) */}
                <button
                    id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                >
                    <i className="fa fa-bars" />
                </button>
                {/* Topbar Navbar */}
                <ul className="navbar-nav ml-auto">
                    {/* Nav Item - Search Dropdown (Visible Only XS) */}
                    {/* Nav Item - Alerts */}
                    <li className="nav-item dropdown no-arrow mx-1">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="alertsDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="fas fa-bell fa-fw" />
                        {/* Counter - Alerts */}
                        <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                    {/* Dropdown - Alerts */}
                    <div
                        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="alertsDropdown"
                    >
                        <h6 className="dropdown-header">Alerts Center</h6>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                            <div className="icon-circle bg-primary">
                            <i className="fas fa-file-alt text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="small text-gray-500">December 12, 2019</div>
                            <span className="font-weight-bold">
                            A new monthly report is ready to download!
                            </span>
                        </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                            <div className="icon-circle bg-success">
                            <i className="fas fa-donate text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="small text-gray-500">December 7, 2019</div>
                            $290.29 has been deposited into your account!
                        </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                            <div className="icon-circle bg-warning">
                            <i className="fas fa-exclamation-triangle text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="small text-gray-500">December 2, 2019</div>
                            Spending Alert: We've noticed unusually high spending for
                            your account.
                        </div>
                        </a>
                        <a
                        className="dropdown-item text-center small text-gray-500"
                        href="#"
                        >
                        Show All Alerts
                        </a>
                    </div>
                    </li>
                    {/* Nav Item - Messages */}
                    <li className="nav-item dropdown no-arrow mx-1">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="messagesDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="fas fa-envelope fa-fw" />
                        {/* Counter - Messages */}
                        <span className="badge badge-danger badge-counter">7</span>
                    </a>
                    {/* Dropdown - Messages */}
                    <div
                        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="messagesDropdown"
                    >
                        <h6 className="dropdown-header">Message Center</h6>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                            <img
                            className="rounded-circle"
                            src="admin_assets/img/undraw_profile_1.svg"
                            alt="..."
                            />
                            <div className="status-indicator bg-success" />
                        </div>
                        <div className="font-weight-bold">
                            <div className="text-truncate">
                            Hi there! I am wondering if you can help me with a problem
                            I've been having.
                            </div>
                            <div className="small text-gray-500">
                            Emily Fowler · 58m
                            </div>
                        </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                            <img
                            className="rounded-circle"
                            src="admin_assets/img/undraw_profile_2.svg"
                            alt="..."
                            />
                            <div className="status-indicator" />
                        </div>
                        <div>
                            <div className="text-truncate">
                            I have the photos that you ordered last month, how would
                            you like them sent to you?
                            </div>
                            <div className="small text-gray-500">Jae Chun · 1d</div>
                        </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                            <img
                            className="rounded-circle"
                            src="admin_assets/img/undraw_profile_3.svg"
                            alt="..."
                            />
                            <div className="status-indicator bg-warning" />
                        </div>
                        <div>
                            <div className="text-truncate">
                            Last month's report looks great, I am very happy with the
                            progress so far, keep up the good work!
                            </div>
                            <div className="small text-gray-500">
                            Morgan Alvarez · 2d
                            </div>
                        </div>
                        </a>
                        <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                            <img
                            className="rounded-circle"
                            src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                            alt="..."
                            />
                            <div className="status-indicator bg-success" />
                        </div>
                        <div>
                            <div className="text-truncate">
                            Am I a good boy? The reason I ask is because someone told
                            me that people say this to all dogs, even if they aren't
                            good...
                            </div>
                            <div className="small text-gray-500">
                            Chicken the Dog · 2w
                            </div>
                        </div>
                        </a>
                        <a
                        className="dropdown-item text-center small text-gray-500"
                        href="#"
                        >
                        Read More Messages
                        </a>
                    </div>
                    </li>
                    <div className="topbar-divider d-none d-sm-block" />
                    {/* Nav Item - User Information */}
                    <li className="nav-item dropdown no-arrow">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="userDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                        Douglas McGee
                        </span>
                        <img
                        className="img-profile rounded-circle"
                        src="admin_assets/img/undraw_profile.svg"
                        />
                    </a>
                    {/* Dropdown - User Information */}
                    <div
                        className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown"
                    >
                        <a className="dropdown-item" href="#">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                        Profile
                        </a>
                        <a className="dropdown-item" href="#">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                        Settings
                        </a>
                        <a className="dropdown-item" href="#">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
                        Activity Log
                        </a>
                        <div className="dropdown-divider" />
                        <a
                        className="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#logoutModal"
                        >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                        Logout
                        </a>
                    </div>
                    </li>
                </ul>
                </nav>
                {/* End of Topbar */}
                {/* Begin Page Content */}
                <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                    <a
                    href="#"
                    className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                    >
                    <i className="fas fa-download fa-sm text-white-50" /> Generate
                    Report
                    </a>
                </div>
                {/* Main Content */}
                </div>
            </div>
            {/* Footer */}
            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>Copyright © Your Website 2021</span>
                </div>
                </div>
            </footer>
            {/* End of Footer */}
            </div>
            {/* End of Content Wrapper */}
        </div>
        {/* End of Page Wrapper */}
        {/* Scroll to Top Button*/}
        <a className="scroll-to-top rounded" href="#page-top">
            <i className="fas fa-angle-up" />
        </a>
        {/* Logout Modal*/}
        <div
            className="modal fade"
            id="logoutModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                    Ready to Leave?
                </h5>
                <button
                    className="close"
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
                </div>
                <div className="modal-body">
                Select "Logout" below if you are ready to end your current session.
                </div>
                <div className="modal-footer">
                <button
                    className="btn btn-secondary"
                    type="button"
                    data-dismiss="modal"
                >
                    Cancel
                </button>
                <a className="btn btn-primary" href="login.html">
                    Logout
                </a>
                </div>
            </div>
            </div>
        </div>
        {/* Bootstrap core JavaScript*/}
        {/* Core plugin JavaScript*/}
        {/* Custom scripts for all pages*/}

    <script src="admin_assets/vendor/jquery/jquery.min.js"></script>
    <script src="admin_assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>


    <script src="admin_assets/vendor/jquery-easing/jquery.easing.min.js"></script>

    <script src="admin_assets/js/sb-admin-2.js"></script>


    </main>
</div>

    );
};

export default Homepage;
