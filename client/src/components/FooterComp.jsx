import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsSend, BsInstagram, BsLinkedin, BsGithub } from "react-icons/bs";

function FooterComp() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 via-red-500 to-orange-500 rounded-lg text-white">
                BLOGGY
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4  sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="" target="blank" rel="noopener noreferrer">
                  Bloggy
                </Footer.Link>
                <Footer.Link href="" target="blank" rel="noopener noreferrer">
                  Resume
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow" />
              <Footer.LinkGroup col>
                <Footer.Link href="" target="blank" rel="noopener noreferrer">
                  Github
                </Footer.Link>
                <Footer.Link href="" target="blank" rel="noopener noreferrer">
                  linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Bloggy"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsLinkedin} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsSend} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComp;
