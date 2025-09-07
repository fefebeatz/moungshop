'use client'

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  useSession,
} from '@clerk/nextjs'
import Link from 'next/link'
import Form from 'next/form'
import { PackageIcon, TrolleyIcon } from '@sanity/icons'
import useBasketStore from '@/sanity/lib/store/store'
import Image from 'next/image'

function Header() {
  const { user } = useUser()
  const { session } = useSession()

  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )

  const createClerkPasskey = async () => {
    if (!session) {
      alert('La session a expiré')
      return
    }
    try {
      const response = await user?.createPasskey()
      console.log(response)
    } catch (error) {
      console.error('Error:', JSON.stringify(error, null, 2))
    }
  }
  return (
    <header className='flex flex-wrap justify-between items-center px-4 py-2'>
      <div className='flex w-full flex-wrap justify-between items-center'>
        <Link
          href='/'
          className='
            text-2xl
            font-bold
            text-gold
            hover:opacity-50
            cursor-pointer
            mx-auto sm:mx-0
            '
        >
          <Image
            src='/moung_shop.png'
            alt='MoungShop Fashion'
            width={160}
            height={40}
            className='h-20 w-auto'
            priority
          />
        </Link>

        <Form
          action='/rechercher'
          className='w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0'
        >
          <input
            type='text'
            name='query'
            placeholder='Rechercher un article...'
            className='
                    bg-gray-100
                    text-gray-800
                    px-4
                    py-2
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-black-300
                    focus:ring-opacity-50
                    border
                    w-full
                    max-w-4xl
                    '
          />
        </Form>

        <div className='flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none'>
          <Link
            href='/panier'
            className='flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-gold hover:bg-gold-hover text-white font-bold py-2 px-4 rounded'
          >
            <TrolleyIcon className='w-6 h-6' />

            {/* affichage du nombre d'articles présents dans le panier */}

            <span
              className='absolute -top-2 -right-2 bg-red-500 text-white
                        rounded-full w-5 h-5 flex items-center justify-center text-xs
                    '
            >
              {itemCount}
            </span>
            <span>Mon panier</span>
          </Link>

          {/* Partie utilisateur */}
          <ClerkLoaded>
            <SignedIn>
              {user && (
                <Link
                  href='/commandes'
                  className='flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-black text-white font-bold py-2 px-4 rounded'
                >
                  <PackageIcon className='w-6 h-6' />
                  <span>Mes commandes</span>
                </Link>
              )}
            </SignedIn>

            {user ? (
              <div className='flex items-center space-x-2'>
                <UserButton />

                <div className='hidden sm:block text-xs'>
                  <p className='text-gray-400'>Bienvenu(e)</p>
                  <p className='font-bold'>{user.fullName}</p>
                </div>
              </div>
            ) : (
              <SignInButton mode='modal'>
                <button
                  className='rounded px-4 py-2 font-semibold text-black border-2 border-black
                            hover:bg-black hover:text-white transition duration-200 cursor-pointer'
                >
                  Se connecter
                </button>
              </SignInButton>
            )}
            {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPasskey}
                className='
                                bg-white
                                hover:bg-gold-hover
                                hover:text-white
                                animate-pulse
                                text-gold
                                font-bold
                                py-2 px-4
                                rounded
                                border-gold
                                border
                                cursor-pointer
                                '
              >
                Générer clé d{"'"}accès
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  )
}

export default Header
