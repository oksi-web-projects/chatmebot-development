import { Fragment } from "react";
import Link from "next/link";
// import { Popover, Transition } from "@headlessui/react";
import { clsx } from "clsx";

// import { signOut, useSession } from "next-auth/react";

import { SignIn, SignOut } from "~/components/auth";
import Button from "~/components/Button";
import { Container } from "~/components/Container";
import { Logo } from "~/components/Logo";
import { NavLink } from "~/components/NavLink";

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
}

// function MobileNavLink({ href, children }: MobileNavLinkProps) {
//   return (
//     <Popover.Button as={Link} href={href} className="block w-full p-2">
//       {children}
//     </Popover.Button>
//   );
// }

interface MobileNavIconProps {
  open: boolean;
}

function MobileNavIcon({ open }: MobileNavIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0",
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
}

// function MobileNavigation() {
//   return (
//     <Popover>
//       <Popover.Button
//         className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
//         aria-label="Toggle Navigation"
//       >
//         {({ open }: MobileNavIconProps) => <MobileNavIcon open={open} />}
//       </Popover.Button>
//       <Transition.Root>
//         <Transition.Child
//           as={Fragment}
//           enter="duration-150 ease-out"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="duration-150 ease-in"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
//         </Transition.Child>
//         <Transition.Child
//           as={Fragment}
//           enter="duration-150 ease-out"
//           enterFrom="opacity-0 scale-95"
//           enterTo="opacity-100 scale-100"
//           leave="duration-100 ease-in"
//           leaveFrom="opacity-100 scale-100"
//           leaveTo="opacity-0 scale-95"
//         >
//           <Popover.Panel
//             as="div"
//             className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
//           >
//             <MobileNavLink href="#features">Features</MobileNavLink>
//             <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
//             <MobileNavLink href="#pricing">Pricing</MobileNavLink>
//             <hr className="m-2 border-slate-300/40" />
//             <MobileNavLink href="/login">Sign in</MobileNavLink>
//           </Popover.Panel>
//         </Transition.Child>
//       </Transition.Root>
//     </Popover>
//   );
// }

interface HeaderProps {
  session: any;
  csrfToken: any;
}

export async function Header({ session, csrfToken }: HeaderProps) {
  let isUser = false;

  if (session) {
    isUser = true;
  }

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            {/* <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div> */}
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {isUser ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <SignOut className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100">
                  Sign out
                </SignOut>
              </>
            ) : (
              <>
                <Button href="/login">Sign in</Button>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}
