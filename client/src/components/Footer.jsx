import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";

export default function FooterComp() {
  return (
    <Footer container className="border border-t-8 border-red-700 bg-slate-800">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1">
        <img src="https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2FSighe%20Auto%20dark.png?alt=media&token=b477e968-c373-42dd-ae91-51d9551c406e" alt="logo" />
        </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-4 sm:gap-6">
          <div>
              <Footer.Title title="Our Services" className="text-white"/>
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  target="_blank"
                  rel="PERIODIC MAINTENANCE"
                >
                  PERIODIC MAINTENANCE
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="Washing Packages "
                >
                  Washing Packages 
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="Lube Services "
                >
                  Lube Services 
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            
            <div>
              <Footer.Title title="About" className="text-white"/>
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abcde efghil
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jklmsc fghis
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" className="text-white"/>
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" className="text-white"/>
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright className="text-white"
            href="#"
            by="All Rights Reserved by Singhe Automotive Company Pvt. Ltd."
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon
              href="#"
              icon={BsGithub}
            />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
